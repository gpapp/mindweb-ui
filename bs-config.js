var proxy = require('http-proxy-middleware');

var apiProxy = proxy(['/auth', '/file', '/public', '/task', '/session'], {
    target: 'http://localhost:8081',
    changeOrigin: true   // for vhosted sites
});

module.exports = {
    "server": {
        "baseDir": "src",
        middleware: [apiProxy],
        port: 8080,
        "routes": {
            "/node_modules": "node_modules"
        }
    }
};