/*global require, angular, document */
// let angular = window.angular;
require('./../../../lib/js/angular-locale');

var component;
angular.element(document).ready(function () {
    angular.bootstrap(document.getElementsByTagName('body')[0], ['comp']);
});
component = angular.module('comp', ['ngLocale', 'tjfdatepicker', 'tjfpagination']);

component.controller('demoCtl', ['$scope', '$filter', function ($scope, $filter) {
    $scope.changeTime = function (dateString) {
        let date = dateString ? new Date(dateString) : new Date();
        $scope.startTime = $filter('date')(date, 'yyyy-MM-dd');
    };
    $scope.changeTime('2001-01-11');
    $scope.startTime = '2017-05-07';
    $scope.endTime = '2017-05-17';

    $scope.date = '2017-03-01';

    //
    $scope.total = 190;
    $scope.page = 1;
    $scope.maxPageNumber = 7;
    $scope.onPageChange = function () {
        console.log($scope.page);
    };
}]);
