const nunjucks = require("nunjucks");
const { stat } = require("mz/fs");
const { extname, join } = require("path");

module.exports = (
  path,
  { extension = "html", type = "text/html", opts = {} }
) => {
  let env = createEnv(path, opts);

  return async (ctx, next) => {
    if (ctx.render) return next();

    ctx.render = (relPath, params = {}) => {
      return getPaths(path, relPath, extension).then(rel => {
        ctx.type = type;
        ctx.body = env.render(rel, params);

        return;
      });
    };

    return next();
  };
};

function createEnv(path, opts) {
  let autoescape = opts.autoescape && true,
    noCache = opts.noCache || false,
    watch = opts.watch || false,
    throwOnUndefined = opts.throwOnUndefined || false,
    tags = opts.tags || {},
    env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(path, {
        noCache,
        watch
      }),
      {
        autoescape,
        throwOnUndefined,
        tags
      }
    );
  if (opts.filters) {
    for (let f in opts.filters) {
      env.addFilter(f, opts.filters[f]);
    }
  }
  return env;
}

function getPaths(abs, rel, ext) {
  return stat(join(abs, rel))
    .then(stats => {
      if (stats.isDirectory())
        // 文件夹
        return join(rel, toFile("index", ext));

      // 文件
      return rel;
    })
    .catch(e => {
      // 不是 文件或者文件夹
      if (!extname(rel) || extname(rel).slice(1) !== ext)
        // 假如没有拓展名，或者拓展名和自定义的不同。
        return getPaths(abs, `${rel}.${ext}`, ext);

      throw e;
    });
}

function toFile(fileName, ext) {
  return `${fileName}.${ext}`;
}
