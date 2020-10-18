const proxy = require('http-proxy-middleware');

const apiUrl = 'http://localhost:5000';
const apiContext = '/api';
// src/setupProxy.js
module.exports = function (app) {
  app.use(
    apiContext,
    proxy({
      target: apiUrl, // 비즈니스 서버 URL 설정
      changeOrigin: true,
    })
  );
};
