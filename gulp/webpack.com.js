/**
 * Created by tangjianfeng on 2017/3/13.
 */
/*global require module __dirname */
const ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    Setting = require('./directory');

let entries = path.resolve(__dirname, 'src', 'components', 'datepicker2', 'index.js');

function getLoaders () {
    return [{
        test: /\.(html|htm)$/,
        loader: 'html',
    }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
    }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015'],
    }];
}


module.exports = {
    // context: __dirname,
    entry: '/Users/tangjianfeng/play/myCmp/src/components/datepicker2/index.js',
    // entry: entries, // webpack在二级目录下,说明调用的时候是以gulpfile所在目录为基准
    watch: false,
    cache: true,
    profile: true,
    output: {
        path: Setting.statics,
        filename: 'ajs/date.js',    // 不能'/'打头，分隔符写到path中
    },
    // devtool: 'eval',
    module: {
        loaders: getLoaders(),
    },
    externals: {
        jquery: true,
        ng: true,
    },
    resolve: {
        alias: {
            'angular': ''
        },
        extensions: ['', '.ts', '.js'],
    },
};
