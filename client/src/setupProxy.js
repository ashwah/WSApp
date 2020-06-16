const { createProxyMiddleware } = require('http-proxy-middleware');
console.log('in setupproxy');
const wsProxy = createProxyMiddleware('/ws', {target:'http://localhost:8080', ws: true});
const apiProxy = createProxyMiddleware('/test', {target:'http://localhost:5000'});

module.exports = function(app) {
  app.use(wsProxy);
  // /app.use(apiProxy);
};
