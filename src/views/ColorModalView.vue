<template>
  <div class="">
    <div id="cesiumContainer"></div>
    <h1>click model</h1>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";

const heatMapEnvironmentUrl =
  "http://3d.topctek.com/model-api/nat20230926/heatmap_environment/tileset.json";
const heatMapCabinetUrl =
  "http://3d.topctek.com/model-api/nat20230926/heatmap_cabinet/tileset.json";

onMounted(() => {
  setCesiumModel(heatMapCabinetUrl);
});

async function setCesiumModel(model_url) {
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
    imageryProvider: false,
  });

  viewer.scene.skyBox = undefined;
  viewer.scene.backgroundColor = Cesium.Color.WHITESMOKE;

  try {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(model_url);
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(
      tileset, // 模型
      new Cesium.HeadingPitchRange( // 模型出現嘅大細，位置
        0, // 角度
        -0.7, // 視角
        tileset.boundingSphere.radius * 3.0 // 大細
      )
    );

    // cesium onclick event listener API
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const clickObject = viewer.scene.pick(click.position);
      if (Cesium.defined(clickObject) && clickObject.tileset === tileset) {
        showtilesetName(tileset, clickObject); // console.log 被點擊模塊名稱
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  } catch (error) {
    console.log(`There was an error while creating the 3D tileset. ${error}`);
  }
}

function showtilesetName(tileset, clickedObject) {
  const clickedObjectName = clickedObject.getProperty("name");
  console.log("點擊模塊 : " + clickedObjectName);
  // 設置模塊顏色
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        [`\${name} === '${clickedObjectName}'`, `color('red')`],
        ["true", "color('white')"], // 默認颜色
      ],
    },
  });
}
</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>