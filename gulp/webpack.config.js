/**
 * Created by tangjianfeng on 2016/10/23.
 */
/*global require, module */
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
// var entries = getEntry('./src/pages/**/index.js');
const entries = getEntry('./src/main/index.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const Setting = require('./directory');


function getEntry (globpath) {
    let entries = {};
    let pathname;
    glob.sync(globpath).forEach(function (entry) {
        // basename = path.basename(entry, path.extname(entry));
        pathname = entry.split('/').splice(-2, 1);
        entries[pathname] = entry;
    });
    return entries;
}


function getLoaders () {
    return [{
        test: /\.ts$/,
        // loader: ExtractTextPlugin.extract('ts')
        // loader: ExtractTextPlugin.extract('awesome-typescript-loader')
        loaders: ['awesome-typescript-loader']
    }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
    }, {
        test: /\.(html|htm)$/,
        loader: 'html',
    }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
    }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015'],
        // query: {
        //     presets: ['es2015']
        // },
        // loader: ExtractTextPlugin.extract('babel?presets[]=es2015')
    }];
}

function getPlugin () {
    let defaultPlugin = [
            new webpack.ProvidePlugin({
                '$': 'jquery',
                'jquery': 'jquery',
                'jQuery': 'jquery',
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: 'js/common.js',
                minChunks: 2,
            }),
            new ExtractTextPlugin('/css/out.[name].css'),
            new webpack.DllReferencePlugin({
                context: Setting.root,
                manifest: require(Setting.root + '/manifest.json'),
                name: 'vendor',
            }),
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false
            //     }
            // })
        ],
        pages = getEntry('./src/main/index.html');
    _.each(pages, function (value, key, object) {
        let conf = {
            template: path.resolve(Setting.root, value),
            filename: path.resolve(Setting.modules, key) + '.html',
            inject: 'body',
            chunks: [key, 'common'],
            excludeChunks: [],
        };
        defaultPlugin.push(new HtmlWebpackPlugin(conf));
    });
    return _.union(defaultPlugin, []);
}

function getPostCss () {
    return '';
}

module.exports = function () {
    return {
        // context: __dirname,
        entry: entries, // webpack在二级目录下,说明调用的时候是以gulpfile所在目录为基准
        watch: true,
        cache: true,
        profile: true,
        output: {
            path: Setting.statics,
            filename: 'js/[name].js',    // 不能'/'打头，分隔符写到path中
        },
        // devtool: 'eval',
        module: {
            // preLoaders: [
            //     {
            //         test: /\.js$/,
            //         loader: 'eslint',
            //         include: Setting.root,
            //         exclude: /node_modules/,
            //     },
            // ],
            loaders: getLoaders(),
        },
        externals: {
            jquery: true,
            ng: true,
        },
        eslint: {
            configFile: Setting.root + '/.eslintrc.js', // 指定eslint的配置文件在哪里
            failOnWarning: false, // eslint报warning了就终止webpack编译
            failOnError: true, // eslint报error了就终止webpack编译
            cache: true, // 开启eslint的cache，cache存在node_modules/.cache目录里
        },
        resolve: {
            alias: {
                'jquery': path.resolve(Setting.nodeModules, 'jquery/dist/jquery.min.js'),
                'angular': path.resolve(Setting.nodeModules, 'angular/angular.min.js'),
            },
            extensions: ['', '.ts', '.js'],
        },
        plugins: getPlugin(),
        postcss: getPostCss(),
    };
}


