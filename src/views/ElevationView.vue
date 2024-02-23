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
const elevationRamp = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 1.0];
const slopeRamp = [0.0, 0, 0, Math.sqrt(2) / 0, 0, 0, 0];
const aspectRamp = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
const minHeight = -414.0; // approximate dead sea elevation
const maxHeight = 8777.0; // approximate everest elevation
const contourColor = Cesium.Color.RED.clone();
let contourUniforms = {};
let shadingUniforms = {};
// The viewModel tracks the state of our mini application.
const viewModel = {
  enableContour: false,
  contourSpacing: 150.0,
  contourWidth: 2.0,
  selectedShading: "elevation",
  changeColor: function () {
    contourUniforms.color = Cesium.Color.fromRandom(
      { alpha: 1.0 },
      contourColor
    );
  },
};

onMounted(() => {
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

  viewer.scene.mode = Cesium.SceneMode.SCENE2D;
  viewer.scene.sun.show = false; // 移除太陽
  viewer.scene.moon.show = false; // 移除月亮
  viewer.scene.skyAtmosphere.show = false; // 移除大氣層
  viewer.scene.skyBox = undefined; // 移除太空背景
  viewer.scene.backgroundColor = Cesium.Color.WHITESMOKE // 設定背景顏色


  function getElevationContourMaterial() {
    // Creates a composite material with both elevation shading and contour lines
    return new Cesium.Material({
      fabric: {
        type: "ElevationColorContour",
        materials: {
          contourMaterial: {
            type: "ElevationContour",
          },
          elevationRampMaterial: {
            type: "ElevationRamp",
          },
        },
        components: {
          diffuse:
            "contourMaterial.alpha == 0.0 ? elevationRampMaterial.diffuse : contourMaterial.diffuse",
          alpha:
            "max(contourMaterial.alpha, elevationRampMaterial.alpha)",
        },
      },
      translucent: false,
    });
  }

  function getSlopeContourMaterial() {
    // Creates a composite material with both slope shading and contour lines
    return new Cesium.Material({
      fabric: {
        type: "SlopeColorContour",
        materials: {
          contourMaterial: {
            type: "ElevationContour",
          },
          slopeRampMaterial: {
            type: "SlopeRamp",
          },
        },
        components: {
          diffuse:
            "contourMaterial.alpha == 0.0 ? slopeRampMaterial.diffuse : contourMaterial.diffuse",
          alpha: "max(contourMaterial.alpha, slopeRampMaterial.alpha)",
        },
      },
      translucent: false,
    });
  }

  function getAspectContourMaterial() {
    // Creates a composite material with both aspect shading and contour lines
    return new Cesium.Material({
      fabric: {
        type: "AspectColorContour",
        materials: {
          contourMaterial: {
            type: "ElevationContour",
          },
          aspectRampMaterial: {
            type: "AspectRamp",
          },
        },
        components: {
          diffuse:
            "contourMaterial.alpha == 0.0 ? aspectRampMaterial.diffuse : contourMaterial.diffuse",
          alpha: "max(contourMaterial.alpha, aspectRampMaterial.alpha)",
        },
      },
      translucent: false,
    });
  }

  function getColorRamp(selectedShading) {
    const ramp = document.createElement("canvas");
    ramp.width = 100;
    ramp.height = 1;
    const ctx = ramp.getContext("2d");

    const grd = ctx.createLinearGradient(0, 0, 100, 0);
    // 假设 temperatures 是一个包含两个元素的数组：最低温度和最高温度
    const minTemp = 0;
    const maxTemp = 100;

    // 根据温度范围添加颜色
    grd.addColorStop(0, "blue"); // 假设低温为蓝色
    grd.addColorStop((maxTemp - minTemp) / 2 / maxTemp, "green"); // 中等温度为绿色
    grd.addColorStop(1, "red"); // 高温为红色

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 1);

    return ramp;
  }

  function updateMaterial() {
    const hasContour = viewModel.enableContour;
    const selectedShading = viewModel.selectedShading;
    const globe = viewer.scene.globe;
    let material;
    if (hasContour) {
      if (selectedShading === "elevation") {
        material = getElevationContourMaterial();
        shadingUniforms =
          material.materials.elevationRampMaterial.uniforms;
        shadingUniforms.minimumHeight = minHeight;
        shadingUniforms.maximumHeight = maxHeight;
        contourUniforms = material.materials.contourMaterial.uniforms;
      } else if (selectedShading === "slope") {
        material = getSlopeContourMaterial();
        shadingUniforms = material.materials.slopeRampMaterial.uniforms;
        contourUniforms = material.materials.contourMaterial.uniforms;
      } else if (selectedShading === "aspect") {
        material = getAspectContourMaterial();
        shadingUniforms = material.materials.aspectRampMaterial.uniforms;
        contourUniforms = material.materials.contourMaterial.uniforms;
      } else {
        material = Cesium.Material.fromType("ElevationContour");
        contourUniforms = material.uniforms;
      }
      contourUniforms.width = viewModel.contourWidth;
      contourUniforms.spacing = viewModel.contourSpacing;
      contourUniforms.color = contourColor;
    } else if (selectedShading === "elevation") {
      material = Cesium.Material.fromType("ElevationRamp");
      shadingUniforms = material.uniforms;
      shadingUniforms.minimumHeight = minHeight;
      shadingUniforms.maximumHeight = maxHeight;
    } else if (selectedShading === "slope") {
      material = Cesium.Material.fromType("SlopeRamp");
      shadingUniforms = material.uniforms;
    } else if (selectedShading === "aspect") {
      material = Cesium.Material.fromType("AspectRamp");
      shadingUniforms = material.uniforms;
    }
    if (selectedShading !== "none") {
      shadingUniforms.image = getColorRamp(selectedShading);
    }

    globe.material = material;
  }


  // Convert the viewModel members into knockout observables.
  Cesium.knockout.track(viewModel);

  // Bind the viewModel to the DOM elements of the UI that call for it.
  // const toolbar = document.getElementById("toolbar");
  // Cesium.knockout.applyBindings(viewModel, toolbar);

  // updateMaterial();

  // Cesium.knockout
  //   .getObservable(viewModel, "enableContour")
  //   .subscribe(function (newValue) {
  //     updateMaterial();
  //   });

  // Cesium.knockout
  //   .getObservable(viewModel, "contourWidth")
  //   .subscribe(function (newValue) {
  //     contourUniforms.width = parseFloat(newValue);
  //   });

  // Cesium.knockout
  //   .getObservable(viewModel, "contourSpacing")
  //   .subscribe(function (newValue) {
  //     contourUniforms.spacing = parseFloat(newValue);
  //   });

  // Cesium.knockout
  //   .getObservable(viewModel, "selectedShading")
  //   .subscribe(function (value) {
  //     updateMaterial();
  //   });

  // Sandcastle.addToolbarMenu(
  //   [
  //     {
  //       text: "Himalayas",
  //       onselect: function () {
  //         viewer.camera.setView({
  //           destination: new Cesium.Cartesian3(
  //             322100.7492728492,
  //             5917960.047024654,
  //             3077602.646977297
  //           ),
  //           orientation: {
  //             heading: 5.988151498702285,
  //             pitch: -1.5614542839414822,
  //             roll: 0,
  //           },
  //         });
  //         viewer.clockViewModel.currentTime = Cesium.JulianDate.fromIso8601(
  //           "2017-09-22T04:00:00Z"
  //         );
  //       },
  //     },
  //     {
  //       text: "Half Dome",
  //       onselect: function () {
  //         viewer.camera.setView({
  //           destination: new Cesium.Cartesian3(
  //             -2495709.521843174,
  //             -4391600.804712465,
  //             3884463.7192916023
  //           ),
  //           orientation: {
  //             heading: 1.7183056487769202,
  //             pitch: -0.06460370548034144,
  //             roll: 0.0079181631783527,
  //           },
  //         });
  //         viewer.clockViewModel.currentTime = Cesium.JulianDate.fromIso8601(
  //           "2017-09-22T18:00:00Z"
  //         );
  //       },
  //     },
  //     {
  //       text: "Vancouver",
  //       onselect: function () {
  //         viewer.camera.setView({
  //           destination: new Cesium.Cartesian3(
  //             -2301222.367751603,
  //             -3485269.915771613,
  //             4812080.961755785
  //           ),
  //           orientation: {
  //             heading: 0.11355958593902571,
  //             pitch: -0.260011078090858,
  //             roll: 0.00039019018274721873,
  //           },
  //         });
  //         viewer.clockViewModel.currentTime = Cesium.JulianDate.fromIso8601(
  //           "2017-09-22T18:00:00Z"
  //         );
  //       },
  //     },
  //     {
  //       text: "Mount Everest",
  //       onselect: function () {
  //         viewer.camera.setView({
  //           destination: new Cesium.Cartesian3(
  //             282157.6960889096,
  //             5638892.465594703,
  //             2978736.186473513
  //           ),
  //           orientation: {
  //             heading: 4.747266966349747,
  //             pitch: -0.2206998858596192,
  //             roll: 6.280340554587955,
  //           },
  //         });
  //         viewer.clockViewModel.currentTime = Cesium.JulianDate.fromIso8601(
  //           "2017-09-22T04:00:00Z"
  //         );
  //       },
  //     },
  //   ],
  //   "zoomButtons"
  // );
});
</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>








[
-268733.977, -133349.351, 0.0, 0.0,
85549.2399, -172404.195, 230126.316, 0.0,
-102290.649, 206142.534, 192462.669, 0.0,
-2177747.76, 4388733.91, 4070062.12, 1.0
]

