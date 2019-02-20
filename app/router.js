const KoaRouter = require("koa-router");

const router = new KoaRouter();

const index = require("./controller");
const pkg = require("../package.json");
const debug = require("debug")(pkg.name + ":bind-router");

// 这里不使用 / 的原因是 / 不生效，原因是app.js 使用了 koa-static 中间件，挂载在了/ 上，直接返回值去了。
router.get("/404", error);

for (let [name, route] of Object.entries(index)) {
  let [method, path] = name.split(" ");

  router[method](path, route);

  debug(path);
}

function error(ctx) {
  ctx.render("error");
}

module.exports = router;
