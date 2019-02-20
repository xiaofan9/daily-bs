const isWin = process.platform === "win32";
const isLinux = process.platform === "linux";
const isDarwin = process.platform === "darwin";
const cmd = isWin
  ? "netstat -ano | findStr "
  : isLinux
    ? "netstat -ntpl | grep"
    : "lsof -i :";
const exec = require("child_process").exec;
const iconv = require("iconv-lite");
const debug = require("debug")("kill");

const getText = t => iconv.decode(new Buffer.from(t, "binary"), "cp936");

const kill = (port = 8080) => {
  return new Promise(function(resolve, reject) {
    exec(cmd + port, { encoding: "binary" }, function(err, stdout, stderr) {
      if (err && !stderr) {
        console.log("err", err);
        return resolve("端口未占用！");
      }

      if (stderr) {
        return reject(getText(stderr));
      }

      let isPY = false;
      let pids = [];

      if (stdout) {
        stdout.split("\n").forEach(function(line, index) {
          const p = line.trim().split(/\s+/);
          const address = p[isWin ? 1 : 3]; // 地址，netstat 能拿到
          const isNode = p[0] === "node"; // 判断 mac 的

          // 打印当前行
          debug(iconv.decode(new Buffer.from(line, "binary"), "cp936"));
          if (address || isNode) {
            if (address.split(":")[1] == port && (isLinux || isWin)) {
              // 端口状态
              if (isWin && p[3] !== "") {
                isPY = true;

                pids.push(p[4]);
              } else if (isLinux && p[5] !== "") {
                isPY = true;

                pids.push(p[6].split("/")[0]);
              }
            }

            if (isNode && isDarwin) {
              isPY = true;

              pids.push(p[1]);
            }
          } else if (index === stdout.split("\n").length - 1 && !isPY) {
            return resolve("端口未占用！");
          }
        });
      }

      return kill(pids);
    });

    function kill(pids) {
      if (pids.length) {
        let cmd = isWin ? "taskkill /F /pid " : "kill -9 ";

        return Promise.all(
          pids.map(pid => {
            return new Promise((resolve, reject) => {
              exec(cmd + pid, { encoding: "binary" }, function(
                err,
                stdout,
                stderr
              ) {
                if (stdout) {
                  resolve();
                } else {
                  reject(err || stderr);
                }
              });
            });
          })
        )
          .then(() => console.log("释放端口成功"))
          .catch(() => console.log("释放端口失败"));
      }
    }
  });
};

module.exports = kill;
