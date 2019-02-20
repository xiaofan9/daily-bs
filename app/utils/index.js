const dateRange = p => {
  let year = parseInt(p.substr(0, 4));
  let month = parseInt(p.substr(4, 2));
  let day = parseInt(p.substr(6, 2));

  let date = new Date(year, month, 0);

  if (
    !(
      (year === 2013 && month === 5 && day > 19 && day <= date.getDate()) ||
      (year === 2013 &&
        month > 5 &&
        month < 13 &&
        day > 0 &&
        day <= date.getDate()) ||
      (year > 2013 &&
        month > 0 &&
        month < 13 &&
        day > 0 &&
        day <= date.getDate())
    )
  ) {
    return false;
  }

  return true;
};

const nowDate = () => {
  let date = new Date();
  let t = n =>
    String.prototype.padStart
      ? String(n).padStart(2, "0")
      : Number.parseInt(n) > 9
        ? n.toString()
        : "0" + n.toString();

  return (
    date.getFullYear() + "-" + t(date.getMonth() + 1) + "-" + t(date.getDate())
  );
};

function getIPAdress() {
  let interfaces = require("os").networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

module.exports = {
  nowDate,
  dateRange,
  getIPAdress,
};
