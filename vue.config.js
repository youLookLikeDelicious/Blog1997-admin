const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const env = dotenv.config().parsed
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[next] = JSON.stringify(env[next])
  return prev
}, {})
if (process.env.NODE_ENV === 'production') {
  envKeys.RSA_PUB_KEY = '""'
}

const defPlugin = new webpack.DefinePlugin(envKeys)
module.exports = {
  publicPath: '/admin/',
  pages: {
    index: {
      entry: ['src/main.js'],
      template: 'public/index.html',
      filename: 'index.html',
      gmap_key: envKeys.GMAP_KEY,
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    auth: {
      entry: ['src/auth.js'],
      template: 'public/auth.html',
      filename: 'auth.html',
      chunks: ['chunk-vendors', 'chunk-common', 'auth']
    }
  },
  // webpack 配置
  configureWebpack: {
    cache: false,
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
      liveReload: true,
      compress: false,
      https: true
      // watchOptions: {
      //   ignored: '/node_modules',
      //   aggregateTimeout: 500,
      //   poll: 1000
      // }
    },
    plugins: [
      defPlugin
    ],
    module: {
      rules: [
        {
          test: /app-config/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'js/[name].[hash].[ext]',
                emitFile: true,
                esModule: process.env.NODE_ENV === 'production'
              }
            }
          ]
        }
      ]
    }
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
  },
  parallel: false
}
