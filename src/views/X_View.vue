<template>
  <div class="">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import Heatmap from "heatmap.js";
const heatMapEnvironmentUrl = "http://3d.topctek.com/model-api/nat20230926/heatmap_environment/tileset.json";

onMounted(() => {
  const cesiumContainer = document.querySelector('#cesiumContainer');
  // 宣告 cesium 實例
  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: false, // 移除地球
    selectionIndicator: false, // 移除選擇指示
    animation: false, // 不顯示動畫控件
    baseLayerPicker: false, // 不顯示基礎圖層選擇器
    fullscreenButton: false, // 不顯示全屏按鈕
    vrButton: false, // 不顯示 VR 按鈕
    geocoder: false, // 不顯示地理編碼器
    homeButton: false, // 不顯示主頁按鈕
    infoBox: false, // 不顯示信息框
    sceneModePicker: false, // 不顯示場景模式選擇器
    selectionIndicator: false, // 不顯示選擇指示器
    timeline: false, // 不顯示時間線
    navigationHelpButton: false, // 不顯示導航幫助按鈕
    navigationInstructionsInitiallyVisible: false,
    creditContainer: undefined, // 移除版權信息容器
    skyBox: null, // 這裡將 skyBox 設置為 null 來移除背景太空
    baseColor : Cesium.Color.RED
  });


  setCesiumModel(viewer, heatMapEnvironmentUrl).then(() => {
    setHeatMap(viewer, cesiumContainer);
  });
});

async function setCesiumModel(viewer, url) {
  try {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(url);
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(
      tileset,  // 模型
      new Cesium.HeadingPitchRange( // 模型出現嘅大細，位置
        0, // 角度
        -0.7, // 視角
        tileset.boundingSphere.radius * 3.0 // 大細
      )
    );
  } catch (error) {
    console.log(`There was an error while creating the 3D tileset. ${error}`);
  }
}

function setHeatMap(viewer, cesiumContainer) {
  const container = document.createElement('div');
  container.style.width = "840px";
  container.style.height = "400px";
  document.body.appendChild(container);

  // 宣告 heatmap 實例
  const heatmapInstance = Heatmap.create({
    container: container,
    radius: 10,
    maxOpacity: 0.5,
    minOpacity: 0,
    blur: 0.75
  });
  // 加資料到 heatmap
  let points = [];
  let max = 0;
  let width = 840;
  let height = 400;
  let spotNumber = 200;
  while (spotNumber--) {
    let temputure = Math.floor(Math.random() * 100);
    max = Math.max(max, temputure);
    let point = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      value: temputure
    };
    points.push(point);
  }
  //  數據格式化
  let data = {
    max: max,
    data: points
  };
  heatmapInstance.setData(data);
  // 建立一個圖層，使用 heatmap 作為紋理
  const heatmapImageryProvider = new Cesium.SingleTileImageryProvider({
    url: heatmapInstance.getDataURL(), // 使用 heatmap.js 的 getDataURL() 方法取得 heatmap 的數據
    rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90), // 圖層覆蓋范圍
    tileWidth: 256, // 示例寛度
    tileHeight: 256 // 示例高度
  });
  viewer.imageryLayers.addImageryProvider(heatmapImageryProvider);
}


</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>