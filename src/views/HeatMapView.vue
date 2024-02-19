<template>
  <div class="heatMap">
    <h1>Heat Map</h1>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { Viewer } from "cesium";

onMounted(() => {
    const viewer = new Viewer("cesiumContainer");
})
</script>