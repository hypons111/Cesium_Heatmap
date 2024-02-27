<template>
  <div class="">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import Heatmap from "heatmap.js";

onMounted(() => {
  const container = document.createElement('div');
  container.style.width = "840px";
  container.style.height = "400px";
  document.body.appendChild(container);

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NmM2NzliMC0yOGZhLTRlNDgtODFhYi00NjcxODY1NDA5YTAiLCJpZCI6MTk2Mzk1LCJpYXQiOjE3MDgzMzgwODZ9.XDk23FhV0AsGpDZXOz7KIDHzvWREWdCLBFQTWHnR5WY";

  const viewer = new Cesium.Viewer("cesiumContainer", {
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
  });
});
</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>