/**
 * Created by tangjianfeng on 2016/10/23.
 */

const _ = require('lodash'),
    Setting = require('./directory'),
    path = require('path'),
    webpack = require('webpack'),
    glob = require('glob'),
    entries = require('./utils').entries,
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash');

function isProd() {
    return process.env.NODE_ENV === 'product';
}

function getEntry (globpath) {
    let entries = {}, pathname,
        extra = ['demo', 'test'];
    glob.sync(globpath).forEach(function (entry) {
        if (isProd()) {
            for (let item of extra) {
                if (entry.indexOf(item) > -1) {
                    return;
                }
            }
        }
        let conDir = entry.replace(Setting.root, '').replace('./src/pages/', ''),
            dirArr = conDir.split('/');
        dirArr.pop();
        pathname = dirArr.join('/');
        entries[pathname] = entry;
    });
    return entries;
}

function getLoaders () {
    return [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css', 'postcss'),
    }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass', 'postcss'),
    }, {
        test: /\.(html|htm)$/,
        exclude: /pages.+?index/,
        loader: 'html',
    }, {
        test: /\.(png|jpe?g|ico)$/,
        loader: 'url',
        query: {
            limit: 8196,
            name: 'statics/images/[name]_[hash:6].[ext]',
        },
    }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
            presets: ['es2015', 'stage-0'],
        },
    }];
}

function getPlugin () {
    let defaultPlugin = [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
                },
            }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'common',
            //     filename: 'statics/js/common_[chunkhash:6].js',
            //     minChunks: 2,
            // }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer',
            }),
            new ExtractTextPlugin('statics/css/[name].css'),
            new WebpackMd5Hash(),
        ],
        pages = getEntry('./src/pages/**/index.html');

    if (isProd()) {
        defaultPlugin.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
                mangle: false
            })
        );
    }

    _.each(pages, function (value, key, object) {
        let conf = {
            template: path.resolve(Setting.root, value),
            filename: isProd()
                ?`${key}.html`
                :`modules/${key}.html`,
            inject: 'body',
            chunks: [key],
            excludeChunks: [],
        };
        defaultPlugin.push(new HtmlWebpackPlugin(conf));
    });
    return _.union(defaultPlugin, []);
}

function mix(obj, obj2) {
    for (let item in obj2) {
        if (obj2.hasOwnProperty(item)) {
            obj[item] = obj2[item];
        }
    }
    return obj;
}

module.exports = {
    // context: __dirname,
    // entry: entries,
    entry: mix({
        'datepicker': 'src/components/datepicker/index',
        'pagination': 'src/components/pagination/index',
        'delegate': 'src/components/delegate/index',
    }, entries),
    watch: true,
    cache: true,
    profile: true,
    output: {
        path: Setting.dest,
        publicPath: '/',                                // 即以path为基
        // filename: 'statics/js/[name]_[chunkhash:6].js',      // 不能'/'打头，分隔符写到path中
        filename: '[name].js'
        // chunkFilename: 'statics/js/chunk_[name].js',
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
    eslint: {
        configFile: Setting.root + '/.eslintrc.js', // 指定eslint的配置文件
        failOnWarning: true,                       // 报warning终止webpack
        failOnError: true,                          // 报error终止
        cache: true,                                // 开启eslint的cache，cache存在node_modules/.cache目录里
    },
    resolve: {
        root: [
            Setting.root,
        ],
        extensions: ['', '.ts', '.js'],
    },
    plugins: getPlugin(),
    htmlLoader: {
        root: Setting.root,
    },
};
