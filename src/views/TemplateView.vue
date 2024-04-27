<template>
  <div class="">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import billboard_icon from "../assets/image/logo.png";
const MODEL_URL =
  "http://3d.topctek.com/model-api/nat20230926/heatmap_environment_TEST/tileset.json";

onMounted(async () => {
  window.viewer = await setViewer();
  setModel(MODEL_URL);
  addLabel();
  addBillboard();
});

function setViewer() {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3OTgwYjIyNS0xNzlmLTQ0YWQtODRhMy1iYTAxOGRkZDQyMmYiLCJpZCI6MTk2Mzk1LCJpYXQiOjE3MTQxNDkyMDJ9.jnx-ICcOXNgxlZjN97uY3Rpdm4l0rHan8neh3fhK6RU";
  try {
    return new Cesium.Viewer("cesiumContainer", {
      // terrainProvider: true, // 是否顯示地球
      selectionIndicator: false, // 是否顯示選擇指示
      animation: false, // 是否顯示動畫控件
      baseLayerPicker: false, // 是否顯示基礎圖層選擇器
      fullscreenButton: false, // 是否顯示全屏按鈕
      vrButton: false, // 是否顯示 VR 按鈕
      geocoder: false, // 是否顯示地理編碼器
      homeButton: false, // 是否顯示主頁按鈕
      infoBox: false, // 是否顯示信息框
      sceneModePicker: false, // 是否顯示場景模式選擇器
      selectionIndicator: false, // 是否顯示選擇指示器
      timeline: false, // 是否顯示時間線
      navigationHelpButton: false, // 是否顯示導航幫助按鈕
      navigationInstructionsInitiallyVisible: false,
      creditContainer: undefined, // 移除版權信息容器
    });
  } catch (e) {
    console.log(`[ERROR] : ${e}`);
  }
}

/* 載入 model */
async function setModel(url) {
  try {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(url);
    tileset.modelMatrix = modelPostion(301.5, 514.88, -65);
    modelAngle(50, 20, 0, tileset.modelMatrix);
    modelScale(0.00001, tileset.modelMatrix);
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(
      tileset, // 模型
      new Cesium.HeadingPitchRange(0, 0.5, tileset.boundingSphere.radius * -10)
    );
  } catch (error) {
    console.log(`[ERROR] : ${error}`);
  }
}

/* 位置 */
function modelPostion(longitude, latitude, height) {
  // 經緯高 轉為 笛卡兒座標
  // longitude(經)，latitude(緯)，height(高)
  const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);

  // 根據 ENU系統 轉為 modelMatrix4x4 陣列
  // ENU系統：模型正面(北方)，右側(東方)，頂部(地球表面的垂直方向)。
  const matrix4Array = Cesium.Transforms.eastNorthUpToFixedFrame(position);

  return matrix4Array;
}

/* 角度 */
function modelAngle(x, y, z, modelMatrix) {
  // 計算x, y, z軸旋轉角度
  const rotationX = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(x));
  const rotationY = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(y));
  const rotationZ = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(z));
  const tempArray = new Cesium.Matrix3();
  const matrix3Array = new Cesium.Matrix3();

  // 乘法順序會影響結果
  Cesium.Matrix3.multiply(rotationZ, rotationY, tempArray);
  Cesium.Matrix3.multiply(tempArray, rotationX, matrix3Array);

  // 套用
  Cesium.Matrix4.multiplyByMatrix3(modelMatrix, matrix3Array, modelMatrix);
}

/* 大小 */
function modelScale(scale, modelMatrix) {
  // 套用
  Cesium.Matrix4.multiplyByUniformScale(modelMatrix, scale, modelMatrix);
}

function addLabel() {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(301.5, 514.88, 40),
    label: {
      text: "LABEL",
      font: "1em Helvetica",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    },
  });
}

function addBillboard() {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(301.5, 514.88, 25),
    billboard: {
      image: billboard_icon, // 图片URL地址
      width: 32, // 像素单位
      height: 32,
      scale: 1.0, // 缩放比例
      color: Cesium.Color.WHITE, // 图片的着色
    },
  });
}
</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>