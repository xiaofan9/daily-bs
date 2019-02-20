const pkg = require("./package.json");

module.exports = {
  apps: [
    {
      name: pkg.name, // 名称
      script: "./bin/www", // 脚本地址
      env: {
        // env 配置
        COMMON_VARIABLE: "true",
        NODE_ENV: "production",
      },
      // 启动环境使用的模式。集群和单个
      exec_mode: "fork",
      interpreter_args: "--trace-sync-io", // node 后缀
      watch: [
        // 监听目录
        "public",
      ],
      // instances: 0, // 意味着PM2将根据CPU的数量（集群模式）启动可能的最大进程
      error_file: "logs/error.log", // 错误日志路径
      out_file: "logs/app.log", // 普通日志路径
      max_memory_restart: "500M", // 内存超过，重启
      max_restarts: 10, // 连续不稳定重启次数（小于1秒间隔或通过min_uptime的自定义时间）
      listen_timeout: 10000, // 监听超时时间
    },
  ],
};
