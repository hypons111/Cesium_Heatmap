const { defineConfig } = require('@vue/cli-service')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        cesium: path.resolve(__dirname, 'node_modules/cesium')
      },
      fallback: {
        "https": false,
        "zlib": false,
        "http": false,
        "url": false
      }
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/Workers'), to: 'Workers' },
          { from: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/ThirdParty'), to: 'ThirdParty' },
          { from: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/Assets'), to: 'Assets' },
          { from: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/Widgets'), to: 'Widgets' }
        ],
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("")
      })
    ],
    amd: {
      toUrlUndefined: true
    }
  },
  chainWebpack: config => {
    // 只有 CESIUM 
    config.module
      .rule('cesium')
      .test(/\.js$/)
      .include
        .add(/node_modules\/cesium/)
        .end()
      .use('script-loader')
        .loader('script-loader');
  }
})
