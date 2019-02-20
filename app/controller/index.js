const service = require("../service");
const { dateRange } = require("../utils");

const index = ctx => {
  ctx.body = "欢迎访问知乎日报api！";
};

const image = async ctx => {
  let { url } = ctx.query;

  let imgData = await service.image(url);

  if (imgData.error) {
    ctx.body = "";
    return;
  }

  ctx.set("Content-Type", "image/jpeg;charset=binary");
  ctx.body = Buffer.from(imgData, "binary");
};

const latest = async ctx => {
  let body = await service.commonRequest("news/latest");

  ctx.body = body;
};

const before = async ctx => {
  // 获取以往的数据
  let { date } = ctx.params;
  let revise = ctx.query.revise;

  if (date.length !== 8) {
    ctx.body = { message: "日期格式不对", code: 101 };
    return;
  }

  if (!dateRange(date)) {
    ctx.body = { message: "日期超过范围", code: 1 };
    return;
  }

  let body = await service.commonRequest("news/before/", date, revise);

  ctx.body = body;
};

const storyExtra = async ctx => {
  let { id } = ctx.params;

  let revise = ctx.query.revise;

  let body = await service.commonRequest("story-extra/", id, revise);

  ctx.body = body;
};

const longComments = async ctx => {
  let { id } = ctx.params;

  let revise = ctx.query.revise;

  let body = await service.commonRequest(
    `story/${id}/long-comments`,
    "",
    revise
  );

  ctx.body = body;
};

const shortComments = async ctx => {
  let { id } = ctx.params;

  let revise = ctx.query.revise;

  let body = await service.commonRequest(
    `story/${id}/short-comments`,
    "",
    revise
  );

  ctx.body = body;
};

const theme = async ctx => {
  let { id } = ctx.params;

  let body = await service.commonRequest("theme/", id);

  ctx.body = body;
};

const themes = async ctx => {
  let body = await service.commonRequest("themes");

  ctx.body = body;
};

const content = async ctx => {
  let { id } = ctx.params;
  let revise = ctx.query.revise;

  let body = await service.commonRequest("news/", id, revise);

  ctx.body = body;
};

module.exports = {
  "get /api": index,
  "get /api/latest": latest,
  "get /api/before/:date": before,
  "get /api/themes": themes,
  "get /api/theme/:id": theme,
  "get /api/image": image,
  "get /api/story-extra/:id": storyExtra,
  "get /api/story/:id/long-comments": longComments,
  "get /api/story/:id/short-comments": shortComments,
  "get /api/content/:id": content
};
