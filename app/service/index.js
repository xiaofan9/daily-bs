const path = require("path");
const request = require("request-promise");

const baseurl = "http://news-at.zhihu.com/api/4/";
const handleContent = require("../middleware/handleContent");

exports.commonRequest = async (block, param = "", revise = true) => {
  let url = baseurl + block + param;
  let error;

  let data = await handleContent(url, revise).catch(err => {
    error = err;

    console.error(err);
  });

  return error
    ? { code: 500, error }
    : {
        code: 200,
        data
      };
};

exports.image = async url =>
  await request
    .get(url)
    .on("response", res => res.setEncoding("binary"))
    .then(r => r)
    .catch(err => {
      let error = new Error(err);

      console.error(error);
      return {
        error
      };
    });
