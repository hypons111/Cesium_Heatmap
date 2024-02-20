<template>
  <div class="">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as Cesium from "cesium";
import Heatmap from "heatmap.js";
// import Heatmap from "";

onMounted(() => {
  const container = document.createElement('div');
  container.style.width = "840px";
  container.style.height = "400px";
  document.body.appendChild(container);

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NmM2NzliMC0yOGZhLTRlNDgtODFhYi00NjcxODY1NDA5YTAiLCJpZCI6MTk2Mzk1LCJpYXQiOjE3MDgzMzgwODZ9.XDk23FhV0AsGpDZXOz7KIDHzvWREWdCLBFQTWHnR5WY";

  const viewer = new Cesium.Viewer("cesiumContainer", {});

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
});
</script>

<style>
#app+div,
.cesium-viewer-bottom,
.cesium-viewer-selectionIndicatorContainer,
.cesium-viewer-infoBoxContainer,
.cesium-viewer-toolbar,
.cesium-viewer-animationContainer,
.cesium-viewer-timelineContainer,
.cesium-viewer-fullscreenContainer {
  display: none !important;
}

.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>