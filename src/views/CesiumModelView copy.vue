<template>
  <div class="">
    <div id="cesiumContainer"></div>
    <canvas id="heatMapCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as Cesium from "cesium";
import Heatmap from "heatmap.js";
const heatMapEnvironmentUrl = "http://3d.topctek.com/model-api/nat20230926/heatmap_environment/tileset.json";




onMounted(() => {
  const cesiumContainer = document.querySelector('#cesiumContainer');
  const viewer = new Cesium.Viewer("cesiumContainer", {
    selectionIndicator: false,
    terrainProvider: false,
  });

  setHeatMap2(viewer)

  const heatmapTexture = new Cesium.Texture({
      context: viewer.scene.context,
      source: document.querySelector('#heatMapCanvas')
  });
  const customMaterial = new Cesium.Material({
      fabric: {
          type: 'Color',
          uniforms: {
              color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
              image: heatmapTexture
          }
      }
  });
  setCesiumModel(viewer, heatMapEnvironmentUrl)
  // .then(() => {
  //   setHeatMap(viewer, cesiumContainer);
  // });
});




async function setCesiumModel(viewer, url) {
  // 隱藏多餘嘅 panel
  viewer.scene.globe.show = false;
  viewer.scene.skyAtmosphere.show = false;
  viewer.scene.skyBox.show = false;
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  viewer.bottomContainer.style.display = "NONE"; //capitalized
  viewer.fullscreenButton.container.style.display = "none"; //not capitalized
  viewer.animation.container.style.display = "none";
  viewer.homeButton.container.style.display = "none";
  viewer.infoBox.container.style.display = "none";
  viewer.navigationHelpButton.container.style.display = "none";
  viewer.timeline.container.style.display = "none";

  try {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(url);
    tileset.root.content.tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['true', `color('${customMaterial}')`]
                ]
            }
        });
    // viewer.scene.primitives.add(tileset);
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
  // 宣告 heatmap 實例
  const heatmapInstance = Heatmap.create({
    container: cesiumContainer,
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


function setHeatMap2(viewer) {
  const heatMapCanvas = document.querySelector('#heatMapCanvas');
  // 宣告 heatmap 實例
  const heatmapInstance = Heatmap.create({
    container: heatMapCanvas,
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