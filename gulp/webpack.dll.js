var path = require("path");
var webpack = require("webpack");
var Setting = require("./directory");

var getAlias = function(){
    return {
        "jquery": path.resolve(Setting.nodeModules, "jquery/dist/jquery.min.js"),
        "angular": path.resolve(Setting.nodeModules, "angular/angular.min.js")
    }
};

module.exports = {
    resolve:{
        alias:getAlias()
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
        })
    ]
};
