var proxy = require('http-proxy-middleware');

var apiProxy = proxy(['/auth', '/map', '/public', '/task', '/session'], {
    target: 'http://localhost:8081',
    changeOrigin: true   // for vhosted sites
});
var wsProxy = proxy(['/ws'], {
    target: 'ws://localhost:8081',
    ws: true,
    changeOrigin: true   // for vhosted sites
});

module.exports = {
    "server": {
        "baseDir": "release",
        middleware: [apiProxy, wsProxy],
        port: 8080
    }
};