/*global require, angular, document */
// let angular = window.angular;
require('./../../../lib/js/angular-locale');

var component;
angular.element(document).ready(function () {
    angular.bootstrap(document.getElementsByTagName('body')[0], ['comp']);


    let a = Delegate('#test'),
        b = Delegate('#test2');

    function handler(event) {console.log(event);}

    function handler2(event) {console.log(222);}

    a.addEvent('click', 'span', handler);
    a.addEvent('click', 'span', handler2);

    a.addEvent('click', 'span', function (event) {
        console.log(11);
    });

    a.addEvent('click', '#test', function () {
        console.log(23423423);
    });

    a.removeEvent('click', 'span', handler);
    a.removeEvent('click', 'span', handler2);

    setTimeout(function () {
        let x = document.querySelector('#test');
        x.click();
        // b.handler.call(x, {
        //     type: 'click',
        //     target: x,
        //     currentTarget: document.querySelector('#test2'),
        // });
    });

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


