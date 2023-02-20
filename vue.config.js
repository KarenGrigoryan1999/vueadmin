module.exports = {
  devServer: {
    host: "lvh.me",
    port: 5000,
    hot: true
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
