/**
 * Created by tangjianfeng on 2016/10/23.
 */
var _ = require("lodash");
var path =require("path");
var webpack = require("webpack");
var glob = require("glob");
// var entries = getEntry("./src/pages/**/index.js");
var entries = getEntry("./src/main/index.js");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var Setting = require("./directory");


function getEntry(globpath) {
    var entries = {},basename, pathname;
    glob.sync(globpath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        pathname = entry.split('/').splice(-2,1);
        entries[pathname] = entry;
    });
    return entries
}


var getLoaders = function(){
    return [{
        test: /\.ts$/,
        // loader: ExtractTextPlugin.extract("ts")
        // loader: ExtractTextPlugin.extract("awesome-typescript-loader")
        loaders: ['awesome-typescript-loader']
    },{
        test:/\.css$/,
        loader: ExtractTextPlugin.extract("style", "css")
    },{
        test:/\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass")
    },{
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel?presets[]=es2015"],
        // query: {
        //     presets: ['es2015']
        // },
        // loader: ExtractTextPlugin.extract("babel?presets[]=es2015")
    }]
};

var getPlugin = function(){
    var defaultPlugin = [
        // new webpack.ProvidePlugin({
        //     "$": "jquery.js",
        //     "jquery": "jquery.js",
        //     "jQuery": "jquery.js"
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "js/common.js",
            minChunks: 2
        }),
        new ExtractTextPlugin('/css/out.[name].css'),
        new webpack.DllReferencePlugin({
            context: Setting.root,
            manifest: require(Setting.root + "/manifest.json"),
            name: "vendor"
        })
    ];
    var pages = getEntry("./src/main/index.html");
    _.each(pages, function(value, key, object) {
        var conf = {
            template: path.resolve(Setting.root, value),
            filename: path.resolve(Setting.modules, key) + '.html',
            inject: "body",
            chunks: [key, 'common'],
            excludeChunks:[]
        };
        defaultPlugin.push(new HtmlWebpackPlugin(conf))
    });
    return _.union(defaultPlugin, []);
};

var getPostCss = function() {
    return ''
};

module.exports = function() {
    return {
        // context: __dirname,
        entry:entries,
        /** webpack在二级目录下,说明调用的时候是以gulpfile所在目录为基准 */
        watch: true,
        cache: true,
        profile:true,
        output: {
            path: Setting.statics,
            filename:"js/[name].js"   /// 不能'/'打头，分隔符写到path中
        },
        // devtool: 'eval',
        module: {
            loaders: getLoaders()
        },
        resolve: {
            extensions: ['', '.ts', '.js']
        },
        plugins: getPlugin(),
        postcss: getPostCss()
    }
};