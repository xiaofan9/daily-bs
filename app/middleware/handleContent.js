const request = require("request-promise");
const { getIPAdress } = require("../utils");
const config = require("../../config");

module.exports = async (url, revise = false) => {
  return await request
    .get(url)
    .then(td => {
      let nd;
      let ip = getIPAdress();

      // 折衷方案
      if (revise) {
        let re = /http[^,'"]*?\.(png|jpg|gif)/gi;
        nd = td.replace(
          re,
          str =>
            (config.host ? config.host : "http://" + ip) +
            (process.env.PORT || config.port
              ? ":" + (process.env.PORT || config.port)
              : "") +
            "/api/image?url=" +
            str
        );
      }

      return JSON.parse(nd || td);
    })
    .catch(err => {
      throw new Error(err);
    });
};
