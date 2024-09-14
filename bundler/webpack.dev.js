const path = require('path');
const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const portFinderSync = require('portfinder-sync');

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

module.exports = merge(commonConfiguration, {
    stats: 'errors-warnings',
    mode: 'development',
    infrastructureLogging: {
        level: 'warn',
    },
    devServer: {
        host: '0.0.0.0', // Bind to all network interfaces
        port: portFinderSync.getPort(8080), // Automatically find an available port
        open: true, // Open the browser on server start
        https: false, // Use HTTP
        allowedHosts: 'all', // Allow all hosts
        hot: true, // Enable hot module replacement
        watchFiles: ['src/**', 'static/**'], // Watch these files for changes
        static: {
            watch: true, // Watch static files for changes
            directory: path.join(__dirname, '../static') // Static file directory
        },
        client: {
            logging: 'none', // No client-side logging
            overlay: true, // Show overlay for build errors
            progress: true // Show build progress
        },
        setupMiddlewares: (middlewares, devServer) => {
            console.log('------------------------------------------------------------');
            console.log(`Host: ${devServer.options.host}`);
            const port = devServer.options.port;
            const https = devServer.options.https ? 's' : '';
            const domain1 = `http${https}://${devServer.options.host}:${port}`;
            const domain2 = `http${https}://localhost:${port}`;
            console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`);
            return middlewares;
        }
    }
});
