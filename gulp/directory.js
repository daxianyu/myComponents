var path = require("path");
var programRoot = path.resolve(__dirname, "../");
var modulesRoot = path.resolve(programRoot, 'dist/modules');
var staticsRoot = path.resolve(programRoot, 'dist/statics');
var nodeModule = path.resolve(programRoot, "node_modules")


module.exports = {
    root: programRoot,
    modules: modulesRoot,
    statics: staticsRoot,
    nodeModules: nodeModule
};