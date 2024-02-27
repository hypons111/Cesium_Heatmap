<template>
  <div class="">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import UITLS from "../assets/js/UITLS"
import MODEL_URL from "../assets/js/MODEL_URL"

onMounted(() => {
  UITLS.setHeatMapModel(MODEL_URL("heatMapEnvironment"), 1000);
});

</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>




