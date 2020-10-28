const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000', // 비즈니스 서버 URL 설정
      changeOrigin: true,
    })
  );
};
