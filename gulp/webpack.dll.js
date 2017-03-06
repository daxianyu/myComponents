const path = require("path");
const webpack = require("webpack");
const Setting = require("./directory");

function getAlias(){
    return {
        "jquery": path.resolve(Setting.nodeModules, "jquery/dist/jquery.min.js"),
        "angular": path.resolve(Setting.nodeModules, "angular/angular.min.js")
    }
}

module.exports = {
    resolve:{
        alias: getAlias()
    },
    entry: {
        vendor:['jquery','angular']
    },
    output: {
        path: Setting.root + "/statics",
        filename: '/js/[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: 'vendor',
            context: Setting.root
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
