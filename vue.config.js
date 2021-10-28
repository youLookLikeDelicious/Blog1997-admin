const path = require('path')
const webpack = require('webpack')
const RSA_PUB_KEY = require('./rsa_pub.js')

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    login: {
      entry: 'src/auth.js',
      template: 'public/login.html',
      filename: 'login.html',
      chunks: ['chunk-vendors', 'chunk-common', 'login']
    }
  },
  // webpack 配置
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src')
      }
    },
    devServer: {
      disableHostCheck: true,
      hot: true,
      port: '9090',
      host: '0.0.0.0',
      liveReload: false,
      compress: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        RSA_PUB_KEY: JSON.stringify(RSA_PUB_KEY)
      })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
        @import "~/assets/sass/_variables.scss";
        @import "~/assets/sass/_mixin.scss";
        @import "~/assets/sass/_placeholder.scss";`
      }
    }
  }
}
