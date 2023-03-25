const fs = require('fs')

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('./certs/priv.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
      host: "lvh.me",
      port: 5000,
      hot: true,
    },
  },

  chainWebpack: config => {
    config.module
      .rule("pug-bem-plain-loader")
      .test(/\.pug$/)
      .use("pug-bem-plain-loader")
      .loader("pug-bem-plain-loader")
      .options({
        e: "__",
        m: "_"
      });
  },

  configureWebpack: {
    devtool: "#source-map"
  },
};
