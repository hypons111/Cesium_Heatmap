# vue3_cesium 紀錄

## 2024-02-19
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

`import Cesium from "cesium"` 會有問題，暫時逐個參數 import `import { Viewer, Ion, Rectangle, SingleTileImageryProvider } from "cesium";`。


## 2024-02-20
可能 Cesium 無默認 export，要咁樣 import `import * as Cesium from "cesium";`

Cesium 而家唔支援 `tileset.readyPromise.then(function() {})`，轉用。

原來唔加 `Cesium.Ion.defaultAccessToken` 都可以正常運作。

用原生地球圖可以入熱力圖係因為地球圖同熱力圖都係 2D，但機房 tileset 係 3D，chat GPI 叫我研究點用「修改模型的材質属性以及使用自定義的着色」。

「修改模型的材質属性以及使用自定義的着色」唔係用 javascript 改，所以唔可行。


## 2024-02-22
而家有4頁：
1. 純 cesium 地球圖
2. cesium 移除地球圖，顯示 .cmpt 模型
3. cesium 顯示 .cmpt 模型 + 熱力圖(Opacity:0.5)
3. cesium 顯示 .cmpt 模型 + 熱力圖(Opacity:1)


```
new Cesium.HeadingPitchRange(
  0, // 角度
  -0.7, // 視角
  tileset.boundingSphere.radius * 3.0 // 大細
)
```
Cesium.HeadingPitchRange 會按下面兩情況，控制嘅嘢會唔同：
a. 有地球圖：地球 + modal 同步縮放、位移、旋轉
b. 無地球圖：modal 縮放、位移、旋轉

如果係 a 情況，可以喺 tileset.json 嘅 transform 改變 modal 尺寸，不過**放大嘅數值**同埋**放大之後變形修正數值**要叫 chat-gpt 計


## 2024-02-23
1. 將模型地板設定為半透明。
2. 用 tileset.json 將模型放大到適合熱力圖的尺寸 (因為沒辧法設定熱力圖尺寸)。
3. 移除移除地球圖片、設定地球底色、設定背景顏色、使用 2.5D 模式。

應該就可以做到接近目標嘅效果，等 Lisa 整個半透明地板嘅模型就可以測試，唯一問題係熱力圖邊界無法控制，會超出模型嘅邊界。
