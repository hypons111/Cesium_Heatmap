# vue3_cesium 紀錄

## 2024-0219
安裝咗 cesium 之後要喺根目錄開一個叫 vue-confing.js 嘅檔案。

使用 AMD 模組規範。 `amd: { toUrlUndefined: true }`。

只有同 cesium 有關嘅嘢使用 AMD 
``` javascript =
  chainWebpack: config => {
    config.module
      .rule('cesium')
      .test(/\.js$/)
      .include
      add(/node_modules\/cesium/)
      .end()
      .use('script-loader')
      .loader('script-loader');
  }
```

未研究 `configureWebpack` 有乜用。

vue-confing.js 用嚟修改 webpack 嘅設定，

webpack 係打包嘅工具，`npm run serve` 同 `npm run build` 嗰陣都會用 webpack 打包。