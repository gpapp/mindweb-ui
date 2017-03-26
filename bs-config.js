var proxy = require('http-proxy-middleware');

var apiProxy = proxy(['/auth', '/map', '/public', '/task', '/session'], {
    target: 'http://localhost:8081',
    changeOrigin: false   // for vhosted sites
});
var wsProxy = proxy(['/ws'], {
    target: 'ws://localhost:8081',
    ws: true,
    changeOrigin: false   // for vhosted sites
});

module.exports = {
    "server": {
        "baseDir": "src",
        middleware: [apiProxy, wsProxy],
        port: 8080,
        "routes": {
            "/node_modules": "node_modules"
        }
    }
};