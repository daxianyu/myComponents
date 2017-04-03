/* globals __dirname */
const path = require('path');

module.exports = {
    base: {
        pages: path.resolve(__dirname, '../src/pages/**/*.js')
    },
    build: {
        assetsPublicPath: '/',
        assetsSubDirectory: '/',
    },
    dev: {
        port: 8008
    },
};
