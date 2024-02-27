<template>
  <div class="">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import utils from "../assets/js/utils"
import MODEL_URL from "../assets/js/MODEL_URL"

onMounted(() => {
  utils.setHeatMapModel(MODEL_URL("heatMapEnvironment"), 1000);
});

</script>

<style>
.cesium-viewer-cesiumWidgetContainer canvas {
  width: 80vw !important;
}
</style>




