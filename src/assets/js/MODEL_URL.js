function MODEL_URL(urlName) {
  const url = {
    heatMapEnvironment : "http://3d.topctek.com/model-api/nat20230926/heatmap_environment_TEST/tileset.json",
    heatMapCabinet : "http://3d.topctek.com/model-api/nat20230926/heatmap_cabinet/tileset.json"
  }
  return url[urlName];
}

export default MODEL_URL