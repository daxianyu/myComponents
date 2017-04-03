/* globals require, rm, cp, mkdir, process, JSON */
require('shelljs/global'); // 引入shell命令

const gulp = require('gulp'),
    fs = require('fs'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    gulpRev = require('gulp-rev'),
    Setting = require('./gulp/directory'),
    connect = require('gulp-connect'),
    gutil = require('gutil'),
    rsync = require('gulp-rsync'),
    rawScript = [
        {jquery: Setting.nodeModules + '/jquery/dist/jquery.min.js'},
        {angular: Setting.nodeModules + '/angular/angular.min.js'},
    ],
    // rawScript = [
    //     {jquery: Setting.nodeModules + '/jquery/dist/jquery.min.js'},
    //     {angular: Setting.nodeModules + '/angular/angular.min.js'},
    // ],
    externals = {
        jquery: 'window.jquery',
        angular: 'window.angular',
    };

gulp.task('webpack', function (done) {                   // 使用原生 webpack 打包
    let fileReg = /\/([^\/]+)$/,
        revMani = JSON.parse(fs.readFileSync(Setting.root + '/rev.json')),
        processedScript = [],
        webpackConfig;
    for (let script of rawScript) {
        let key = Object.keys(script)[0],
            value = script[key];
        if (value) {
            processedScript.push('/statics/' + revMani[value.match(fileReg)[1]]);
        }
    }
    done();
    webpackConfig = require('./gulp/webpack.config');
    webpack(merge(webpackConfig, {
        watch: process.env.NODE_ENV === 'develop',
        externals: externals,
        htmlTag: processedScript,
    }), function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
        }));
        done();
    });
});

gulp.task('copy', function (done) {
    rm('-rf', Setting.dest + '/*');
    mkdir('dist/modules');
    mkdir('dist/statics');
    return gulp.src(rawScript.map((item) =>{
        return item[Object.keys(item)[0]];
    }))
        .pipe(gulpRev())
        .pipe(gulp.dest(Setting.statics))
        .pipe(gulpRev.manifest('rev.json'))
        .pipe((() => {
            done();
            return gulp.dest(Setting.root);
        })());
});


gulp.task('server', function (done) {                    // 纯server服务
    done();
    return connect.server({
        port: 8888,
        root: './dist',
    });
});

gulp.task('develop', function (done) {
    process.env.NODE_ENV = 'develop';
    done();
});
gulp.task('test', function (done) {
    process.env.NODE_ENV = 'develop';
    done();
});
gulp.task('production', function (done) {
    process.env.NODE_ENV = 'product';
    done();
});

gulp.task('deploy', function () {   // 发布用
    return gulp.src('dist/**')
        .pipe(rsync({
            root: 'dist/',
            hostname: 'daxianyu.cn',
            destination: '/data/dxy-widget/',
            username: 'root',
            archive: true,
            silent: false,
            compress: true,
            recursive: true,
            port: '22',
            clean: true,
            options: {
                backup: true,
                update: true,
                'backup-dir': '/root/source/backup/backup_$(date +\%y-\%m-\%d)',
            },
        }));
});
gulp.task('backup', function () {
    return gulp.src();
});

gulp.task('build', gulp.series('copy', 'server', 'webpack'));        // 推荐用这个作为起始构建
gulp.task('default', gulp.series('develop', 'server', 'webpack'));                 // 第二次构建则直接用gulp即可
gulp.task('prod', gulp.series('production', 'copy', 'webpack'));
