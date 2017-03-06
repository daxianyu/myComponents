/* global require, module, __dirname*/
let path = require('path'),
    programRoot = path.resolve(__dirname, '../'),
    modulesRoot = path.resolve(programRoot, 'dist/modules'),
    staticsRoot = path.resolve(programRoot, 'dist/statics'),
    nodeModule = path.resolve(programRoot, 'node_modules');


module.exports = {
    root: programRoot,
    modules: modulesRoot,
    statics: staticsRoot,
    nodeModules: nodeModule,
};
