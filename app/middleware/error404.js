module.exports = async (ctx, next) => {
  await next();

  if (!ctx.body && ctx.body !== "") {
    // 检测 ctx.body 是否存在内容。"" 好像也会认为是假的。
    ctx.status = 404;

    ctx.redirect("/404");
  }
};
