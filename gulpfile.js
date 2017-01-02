require("shelljs/global"); //// 引入shell命令
var gulp = require("gulp");
var glob = require("glob");
var path = require("path");
var webpack = require("webpack");
var webpackStream = require("webpack-stream");
var webpackDllConfig = require("./gulp/webpack.dll.js");
var Setting = require("./gulp/directory");
var connect = require("gulp-connect");
var WebpackDevServer = require("webpack-dev-server");
var gutil = require("gutil");

var webpackConfig = require("./gulp/webpack.config")();


/** 首先运行gulp b 运行第三方库文件打包以及项目构建
 *  如果第三方库没有变动,则直接运行gulp项目构建
 *  也可运行gulp dll 只对第三方库进行打包
 *  */


gulp.task("dll", function (done) {
    webpack(webpackDllConfig, function () {
        done();
    })
});

gulp.task("webpack", function(done) {                   /** 使用原生 webpack 打包*/
    rm("-rf", Setting.statics);done();
    webpack(webpackConfig, function(err,stats){
        cp("-r", './statics/js/', Setting.statics);
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }));
        done();
    })
});

gulp.task("ws", function (done) {                        /** 使用webpack stream进行打包,但是貌似没什么效果 */
    return webpackStream(webpackConfig);
});

gulp.task("server", function (done) {                    /** 纯server服务  */
    done();
    return connect.server({
        port: 8888,
        root: "./dist"
    })
});

gulp.task("webpack-dev-server", function (done) {        /** 开发加服务器加监听 */
    new WebpackDevServer(webpack(webpackConfig), {}).listen(8889, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    })
});


gulp.task("b", gulp.series("dll", "webpack", "server"));
gulp.task("bs", gulp.series("dll", "server", "ws"));
gulp.task("default", gulp.series("webpack"));