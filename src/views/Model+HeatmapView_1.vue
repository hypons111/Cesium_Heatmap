<template>
  <div class="">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import Heatmap from "heatmap.js";
const heatMapEnvironmentUrl = "http://3d.topctek.com/model-api/nat20230926/heatmap_environment_TEST/tileset.json";
const heatMapCabinetUrl = "http://3d.topctek.com/model-api/nat20230926/heatmap_cabinet/tileset.json";

onMounted(() => {
  // const cesiumContainer = document.querySelector('#cesiumContainer');
  // // 宣告 cesium 實例
  const viewer = new Cesium.Viewer("cesiumContainer", {
    // terrainProvider: false, // 移除地球
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
    navigationInstructionsInitiallyVisible: false, // 不顥示導航說明
    creditContainer: undefined, // 移除版權信息容器
    imageryProvider: false, // 移除地球圖片
  });

  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 8000000; // 限制視點的最近距離
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000; // 限制視點的最遠距離
  viewer.scene.globe.baseColor = Cesium.Color.WHITESMOKE; // 移除地球圖片後的地球顏色
  viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW; // 使用 2.5D 模式
  viewer.scene.sun.show = false; // 移除太陽
  viewer.scene.moon.show = false; // 移除月亮
  viewer.scene.skyAtmosphere.show = false; // 移除大氣層
  viewer.scene.skyBox = undefined; // 移除太空背景
  viewer.scene.backgroundColor = Cesium.Color.WHITESMOKE // 設定背景顏色

  setCesiumModel(viewer, heatMapEnvironmentUrl).then(() => {
    setHeatMap(viewer, cesiumContainer);
  });
});

async function setCesiumModel(viewer, model_url) {
  try {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(model_url);
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(
      tileset,  // 模型
      new Cesium.HeadingPitchRange( // 當有地球圖時就會係地球的大細，位置
        0, // 角度
        -0.7, // 視角
        tileset.boundingSphere.radius * 3.0 // 大細
      )
    );
  } catch (error) {
    console.log(`There was an error while creating the 3D tileset. ${error}`);
  }
}

function setHeatMap(viewer) {
  const container = document.createElement('div');
  container.style.width = "400px";
  container.style.height = "400px";
  document.body.appendChild(container);

  // 宣告 heatmap 實例
  const heatmapInstance = Heatmap.create({
    container: container,
    radius: 20,
    maxOpacity: 0.5,
    minOpacity: 0.5,
    blur: 1,
    max: 100
  });

  // 加資料到 heatmap
  let data = {
    max: 100,
    data: [
      {
        x: 330,
        y: 90,
        value: 100
      },{
        x: 330,
        y: 105,
        value: 100
      },{
        x: 330,
        y: 120,
        value: 100
      },{
        x: 330,
        y: 135,
        value: 100
      },
    ]
  };

  heatmapInstance.setData(data);

  // 建立一個圖層，使用 heatmap 作為紋理
  const heatmapImageryProvider = new Cesium.SingleTileImageryProvider({
    url: heatmapInstance.getDataURL(), // 使用 heatmap.js 的 getDataURL() 方法取得 heatmap 的數據
    rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90), // 圖層覆蓋范圍 (覆蓋整個地球)
    tileWidth: 0, // 示例寛度 (唔知有乜用，放咩數值都無反應)
    tileHeight: 0 // 示例高度 (唔知有乜用，放咩數值都無反應)
  });
  viewer.imageryLayers.addImageryProvider(heatmapImageryProvider);
}
</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>
