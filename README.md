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
**cmpt+tileset** 方法：
1. 用 **heatmap.js** 產生熱力圖。
2. 將熱力圖貼喺地球圖上面，之後移除地球圖貼圖再換成需要底色。
3. 模型地板要顯示熱力圖嘅範圍做透明。
4. 用 **tileset.json** 將模型放大到適合尺寸。
5. 使用 **2.5D** 模式。


## 2024-02-26
**cmpt+tileset** 方法成功，下一步就要將啲步驟模組化。
但都係要試吓用 **.glft** 格式，始終覺得呢個方法先係正解。


## 2024-02-27
原來 **cesium** 要安裝 **script-loader** 嚟導入。

喺屋企開一包新嘅 **cesium** 會報錯：
`Warning Vue Router warn: Unexpected error when starting the router: – ReferenceError: Can't find variable: require ReferenceError: Can't find variable: require`，
即係喺 vue 是完全基於 ES 模塊，唔可以用 `require` 嚟讀入文件。
但我搵唔除咗 **vue-config.js** 之外到邊度有用 `require`，但 chat-GPT 又話因為 **vue-config.js** 係由 **node.js** 執行，所以可以用 `require`。


## 2024-02-28
產生 cesium viewer、heat map、模型嘅程式碼都模組化咗，放喺 **UTILS.js**
取得模型資料嘅 URL 放喺 **MODEL_URL.js**