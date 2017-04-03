/* globals require __dirname module */

var path = require('path'),
    programRoot = path.resolve(__dirname, '../'),
    dest = path.resolve(programRoot, 'dist'),
    src = path.resolve(programRoot, 'src'),
    modulesRoot = path.resolve(programRoot, 'dist/modules'),
    staticsRoot = path.resolve(programRoot, 'dist/statics'),
    nodeModule = path.resolve(programRoot, 'node_modules');

module.exports = {
    root: programRoot,
    dest: dest,
    src: src,
    modules: modulesRoot,
    statics: staticsRoot,
    nodeModules: nodeModule,
};
