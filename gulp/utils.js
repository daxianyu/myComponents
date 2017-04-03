/* global require, module */
const glob = require('glob'),
    path = require('path'),
    dirs = require('./config').base.pages,
    entries = getEntry(dirs);

function getEntry(globPath) {
    let entries = {},
        tmp, pathname;

    glob.sync(globPath).forEach(function (entry) {
        let page = entry.split('src/pages')[1];
        if (page) {
            tmp = entry.split('src/pages')[1].split('/').splice(1);
            tmp.pop();
            pathname = tmp.join('/');        // 正确输出js和html的路径
            entries[pathname] = entry;
        }
    });
    return entries;
}

module.exports = {
    entries,
};
