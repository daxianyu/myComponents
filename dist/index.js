/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 15:
/***/ function(module, exports) {

	/**
	 * Created by tangjianfeng on 2017/1/2.
	 */
	/**
	 * Created by tangjianfeng on 2016/12/30.
	 */
	'use strict';

	angular.module("ngLocale", [], ["$provide", function ($provide) {
	    var PLURAL_CATEGORY = { ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other" };
	    $provide.value("$locale", {
	        "DATETIME_FORMATS": {
	            "AMPMS": ["\u4E0A\u5348", "\u4E0B\u5348"],
	            "DAY": ["\u661F\u671F\u65E5", "\u661F\u671F\u4E00", "\u661F\u671F\u4E8C", "\u661F\u671F\u4E09", "\u661F\u671F\u56DB", "\u661F\u671F\u4E94", "\u661F\u671F\u516D"],
	            "ERANAMES": ["\u516C\u5143\u524D", "\u516C\u5143"],
	            "ERAS": ["\u516C\u5143\u524D", "\u516C\u5143"],
	            "FIRSTDAYOFWEEK": 6,
	            "MONTH": ["\u4E00\u6708", "\u4E8C\u6708", "\u4E09\u6708", "\u56DB\u6708", "\u4E94\u6708", "\u516D\u6708", "\u4E03\u6708", "\u516B\u6708", "\u4E5D\u6708", "\u5341\u6708", "\u5341\u4E00\u6708", "\u5341\u4E8C\u6708"],
	            "SHORTDAY": ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"],
	            "SHORTMONTH": ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"],
	            "STANDALONEMONTH": ["\u4E00\u6708", "\u4E8C\u6708", "\u4E09\u6708", "\u56DB\u6708", "\u4E94\u6708", "\u516D\u6708", "\u4E03\u6708", "\u516B\u6708", "\u4E5D\u6708", "\u5341\u6708", "\u5341\u4E00\u6708", "\u5341\u4E8C\u6708"],
	            "WEEKENDRANGE": [5, 6],
	            "fullDate": "y\u5E74M\u6708d\u65E5EEEE",
	            "longDate": "y\u5E74M\u6708d\u65E5",
	            "medium": "y\u5E74M\u6708d\u65E5 ah:mm:ss",
	            "mediumDate": "y\u5E74M\u6708d\u65E5",
	            "mediumTime": "ah:mm:ss",
	            "short": "yy/M/d ah:mm",
	            "shortDate": "yy/M/d",
	            "shortTime": "ah:mm"
	        },
	        "NUMBER_FORMATS": {
	            "CURRENCY_SYM": "\xA5",
	            "DECIMAL_SEP": ".",
	            "GROUP_SEP": ",",
	            "PATTERNS": [{
	                "gSize": 3,
	                "lgSize": 3,
	                "maxFrac": 3,
	                "minFrac": 0,
	                "minInt": 1,
	                "negPre": "-",
	                "negSuf": "",
	                "posPre": "",
	                "posSuf": ""
	            }, {
	                "gSize": 3,
	                "lgSize": 3,
	                "maxFrac": 2,
	                "minFrac": 2,
	                "minInt": 1,
	                "negPre": "-\xA4\xA0",
	                "negSuf": "",
	                "posPre": "\xA4\xA0",
	                "posSuf": ""
	            }]
	        },
	        "id": "zh-cn",
	        "localeID": "zh_CN",
	        "pluralCat": function pluralCat(n, opt_precision) {
	            return PLURAL_CATEGORY.OTHER;
	        }
	    });
	}]);

/***/ },

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*global require, angular, document */
	// let angular = window.angular;
	__webpack_require__(15);

	var component;
	angular.element(document).ready(function () {
	    angular.bootstrap(document.getElementsByTagName('body')[0], ['comp']);

	    var a = Delegate('#test'),
	        b = Delegate('#test2');

	    function handler(event) {
	        console.log(event);
	    }

	    function handler2(event) {
	        console.log(222);
	    }

	    a.addEvent('click', 'span', handler);
	    a.addEvent('click', 'span', handler2);

	    a.addEvent('click', 'span', function (event) {
	        console.log(11);
	    }, true);

	    a.addEvent('click', '#test', function () {
	        console.log(23423423);
	    });

	    a.removeEvent('click', 'span', handler);
	    a.removeEvent('click', 'span', handler2);

	    // setTimeout(function () {
	    //     let x = document.querySelector('#test');
	    // b.handler.call(x, {
	    //     type: 'click',
	    //     target: x,
	    //     currentTarget: document.querySelector('#test2'),
	    // });
	    // });
	});

	component = angular.module('comp', ['ngLocale', 'tjfdatepicker', 'tjfpagination']);

	component.controller('demoCtl', ['$scope', '$filter', function ($scope, $filter) {
	    $scope.changeTime = function (dateString) {
	        var date = dateString ? new Date(dateString) : new Date();
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

/***/ }

/******/ });