import * as Cesium from 'cesium';

const test = {
  install: (app, options) => {
    Cesium.Ion.defaultAccessToken = options.accessToken;
    app.config.globalProperties.$cesium = Cesium;
  }
};

export default test;

