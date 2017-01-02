/**
 * Created by tangjianfeng on 2017/1/1.
 */
require('../components/components');
require("./angular-locale");
var prefix = require('../config').prefix;
var importedModules = require('../components/components').components.map(function (item) {
    return prefix + item
});
importedModules.push('ngLocale');

var angular = require('angular');

var comp = angular.module('comp', importedModules);

angular.element(document).ready(function () {
    angular.bootstrap(document.getElementsByTagName('body')[0], ['comp'])
});

comp.controller("datePickerCtl", ["$scope", "$filter", function ($scope, $filter) {
    $scope.changeTime = function (dateString) {
        let date = dateString? new Date(dateString):new Date();
        $scope.startTime = $filter('date')(date, "yyyy-MM-dd");
    };
    $scope.changeTime('2001-01-11');
}]);
