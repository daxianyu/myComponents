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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	/**
	 * Created by tangjianfeng on 2017/1/1.
	 */
	/* global require, navigator */

	/*
	* timeZoneOffset拿来补偿
	* 因时区的原因导致的在new Date('2017-01-01')时，
	* 与格林尼治时间的差
	* new Date('2017-01-01')是格林尼治的0点0分0秒，在我们所在地区则是8点钟
	* new Date('2017-01-01').getHours() === 8
	* 我要把时间轴拉回到，startDate.getHours() === 0
	* 古老的东方最先迎来新年....
	* */

	var angular = window.angular,
	    prefix = __webpack_require__(5).prefix;


	(function withAngular(angular, navigator) {
	    'use strict';

	    var dateViewIndex = 0,
	        monthViewIndex = 1,
	        yearViewIndex = 2,
	        dateUtil = __webpack_require__(6),
	        calDateTime = __webpack_require__(7),
	        getDateTime = dateUtil.getDateTime,
	        isValidDate = dateUtil.isValidDate;

	    var mainViewHtml = __webpack_require__(9),
	        dateViewHtml = __webpack_require__(10),
	        monthViewHtml = __webpack_require__(11),
	        yearViewHtml = __webpack_require__(12);

	    function datePickerDirective($window, $compile, $filter, $locale, $timeout) {
	        // 记录两个日期：一个是上次改后的日期，一个是记录浏览过程中的当前页日期信息
	        // 作水平切换时，只有上次改后的日期所在的年、月、日才作active显示
	        function linkingFunction($scope, elm, attr) {
	            var isOverMax = __webpack_require__(13),
	                isOverMin = __webpack_require__(14);
	            var thisInput = angular.element(elm[0].children[0]),
	                $theCalender = angular.element(elm),
	                theCalender = $theCalender[0],

	            // calendar html view
	            mainView = $compile(mainViewHtml)($scope),
	                dateView = $compile(dateViewHtml)($scope),
	                monthView = $compile(monthViewHtml)($scope),
	                yearsView = $compile(yearViewHtml)($scope),
	                nowTime = new Date(),
	                dateFormats = $locale.DATETIME_FORMATS,
	                maxLimitDate = $scope.dateMaxLimit ? new Date($scope.dateMaxLimit) : null,
	                minLimitDate = $scope.dateMinLimit ? new Date($scope.dateMinLimit) : new Date(0),
	                // 如果没有设定最小，则为1970年
	            changeView = void 0,
	                isMouseOnInput = false,
	                isMouseOn = false;

	            $scope.dateTime = {}; // 上次改后的日期
	            $scope.glanceView = {}; // 浏览过程中的当前页日期信息

	            $scope.open = false;
	            $scope.days = dateFormats.SHORTDAY;
	            $scope.months = dateFormats.SHORTMONTH;

	            isOverMax.init($scope, maxLimitDate);
	            isOverMin.init($scope, minLimitDate);
	            // 作为比较的函数
	            $scope.isOverMaxDate = isOverMax.date.bind(null, $scope.glanceView);
	            $scope.isOverMaxMonth = isOverMax.month.bind(null, $scope.glanceView);
	            $scope.isOverMaxYear = isOverMax.year.bind(null, $scope.glanceView);
	            $scope.isOverMinDate = isOverMin.date.bind(null, $scope.glanceView);
	            $scope.isOverMinMonth = isOverMin.month.bind(null, $scope.glanceView);
	            $scope.isOverMinYear = isOverMin.year.bind(null, $scope.glanceView);

	            function resetLimit() {
	                // 重置最大小日期限制
	                maxLimitDate = $scope.dateMaxLimit ? new Date($scope.dateMaxLimit) : null;
	                minLimitDate = $scope.dateMinLimit ? new Date($scope.dateMinLimit) : new Date(0);
	            }

	            function resetDateTime() {
	                // 初始化重置日期或当手工修改input时重置
	                var initTime = isValidDate($scope.initDate) ? new Date(new Date($scope.initDate).valueOf() + calDateTime.timeZoneOffset) : nowTime;
	                $scope.dateTime = {
	                    date: initTime.getDate(),
	                    month: $scope.glanceView.month = initTime.getMonth() + 1,
	                    year: $scope.glanceView.year = initTime.getFullYear()
	                };
	            }

	            function showCalender() {
	                // 点击弹出选择器时触发，一系列重置
	                theCalender.classList.add('open');
	                resetLimit(); // 因为如果start-date和end-date联动相互制约，则需要每次都init
	                isOverMax.init($scope, maxLimitDate);
	                isOverMin.init($scope, minLimitDate);
	                $scope.glanceView.year = $scope.dateTime.year;
	                $scope.glanceView.month = $scope.dateTime.month;
	                $scope.glanceView.date = $scope.dateTime.date;
	                changeView.set(dateViewIndex); // reset to dateView
	            }

	            function hideCalender() {
	                theCalender.classList.remove('open');
	            }

	            // 封装选择器视图操作
	            changeView = function changeView2() {
	                var $preHeader = angular.element(mainView[0].querySelector('.calender-header')),
	                    viewIndex = 0,
	                    dateViewObj = {
	                    name: 'date',
	                    DOM: dateView,
	                    getTitle: function getTitle() {
	                        return $scope.months[$scope.glanceView.month - 1];
	                    },
	                    prev: function prev() {
	                        var dtv = $scope.glanceView;
	                        if (dtv.month === 1) {
	                            dtv.year -= 1;
	                            dtv.month = 12;
	                        } else {
	                            dtv.month--;
	                        }
	                        this.replaceView();
	                    },
	                    next: function next() {
	                        var dtv = $scope.glanceView;
	                        if (dtv.month === 12) {
	                            dtv.year += 1;
	                            dtv.month = 1;
	                        } else {
	                            dtv.month++;
	                        }
	                        this.replaceView();
	                    },
	                    replaceView: function replaceView() {
	                        var dateViewArr = calDateTime.getDateViewArr($scope.glanceView);
	                        $scope.dates = dateViewArr.thisMonthDays;
	                        $scope.prevDates = dateViewArr.prevMonthDays;
	                        $scope.nextDates = dateViewArr.nextMonthDays;

	                        $scope.overMax = $scope.isOverMaxMonth();
	                        $scope.overMin = $scope.isOverMinMonth();
	                        $scope.selectedView = this.getTitle();
	                    }
	                },
	                    monthViewObj = {
	                    name: 'month',
	                    DOM: monthView,
	                    getTitle: function getTitle() {
	                        return $scope.glanceView.year + '年';
	                    },
	                    prev: function prev() {
	                        $scope.glanceView.year--;
	                        this.replaceView();
	                    },
	                    next: function next() {
	                        $scope.glanceView.year++;
	                        this.replaceView();
	                    },
	                    replaceView: function replaceView() {
	                        $scope.overMax = $scope.isOverMaxYear();
	                        $scope.overMin = $scope.isOverMinYear();
	                        $scope.selectedView = this.getTitle();
	                    }
	                },
	                    yearViewObj = {
	                    name: 'year',
	                    DOM: yearsView,
	                    getTitle: function getTitle() {
	                        return $scope.years[0] + ' - ' + $scope.years[15];
	                    },
	                    prev: function prev() {
	                        var endYear = $scope.years[0] - 1,
	                            i = 16,
	                            arr = [];
	                        while (i--) {
	                            arr.push(endYear - i);
	                        }
	                        $scope.years = arr;
	                        this.replaceView(true);
	                    },
	                    next: function next() {
	                        var startYear = $scope.years[15],
	                            i = 0,
	                            arr = [];
	                        while (i++ < 16) {
	                            arr.push(startYear + i);
	                        }
	                        $scope.years = arr;
	                        this.replaceView(true);
	                    },
	                    replaceView: function replaceView(flag) {
	                        var arr = [];
	                        if (!flag) {
	                            var thisYear = $scope.glanceView.year,
	                                startYear = thisYear - 11,
	                                endYear = thisYear + 5;
	                            while (startYear++ < endYear) {
	                                arr.push(startYear);
	                            }
	                            $scope.years = arr;
	                        }
	                        $scope.overMax = maxLimitDate ? $scope.years[$scope.years.length - 1] > maxLimitDate.getFullYear() : false;
	                        $scope.overMin = $scope.years[0] < minLimitDate.getFullYear();
	                        $scope.selectedView = this.getTitle();
	                    }
	                },
	                    views = [dateViewObj, monthViewObj, yearViewObj];

	                function switchView() {
	                    var preBody = mainView[0].querySelector('#date-picker-switch');
	                    preBody.remove();
	                    $preHeader.after(views[viewIndex].DOM);
	                    views[viewIndex].replaceView();
	                }
	                function upward() {
	                    if (viewIndex < views.length - 1) {
	                        viewIndex++;
	                        switchView();
	                    }
	                }
	                function downward() {
	                    if (viewIndex > 0) {
	                        viewIndex--;
	                        switchView();
	                    }
	                }
	                function prev() {
	                    views[viewIndex].prev();
	                }
	                function next() {
	                    views[viewIndex].next();
	                }
	                function set(index) {
	                    if (index >= dateViewIndex && index < views.length) {
	                        viewIndex = index;
	                        switchView();
	                    }
	                }

	                return {
	                    set: set,
	                    prev: prev,
	                    next: next,
	                    upward: upward,
	                    downward: downward
	                };
	            }();

	            // 按钮操作：向上一级选择、水平向前选择、水平向后选择、选择年、月、日
	            $scope.upSelect = changeView.upward;
	            $scope.prev = changeView.prev;
	            $scope.next = changeView.next;
	            $scope.setYear = function (year) {
	                $scope.glanceView.year = year;
	                changeView.downward();
	            };
	            $scope.setMonth = function (month) {
	                $scope.glanceView.month = month;
	                changeView.downward();
	            };
	            $scope.setDate = function (date) {
	                var dtv = $scope.glanceView,
	                    resultDateTime = void 0;
	                date ? dtv.date = date : '';
	                $scope.dateTime.year = dtv.year;
	                $scope.dateTime.month = dtv.month;
	                $scope.dateTime.date = dtv.date;
	                resultDateTime = getDateTime($scope.dateTime);
	                thisInput.val($filter('date')(resultDateTime, 'yyyy-MM-dd'));
	                thisInput.triggerHandler('input'); // 最后触发一下事件，让angular执行循环
	                thisInput.triggerHandler('change');
	                if (date) {
	                    hideCalender();
	                }
	            };

	            // 标记鼠标位置，来选择执行什么事件
	            thisInput.on('click focus focusin', function clickAndFocus() {
	                isMouseOnInput = true;
	                if (!isMouseOnInput && !isMouseOn) {
	                    hideCalender();
	                } else {
	                    $scope.$apply(function () {
	                        showCalender();
	                    });
	                }
	            });
	            thisInput.on('keydown', function (event) {
	                if (event.keyCode === 9 || event.keyCode === 13) {
	                    hideCalender();
	                }
	            });
	            thisInput.on('blur focusout', function blur() {
	                isMouseOnInput = false;
	            });
	            $theCalender.on('mouseenter', function onMouseEnter() {
	                isMouseOn = true;
	            });
	            $theCalender.on('mouseleave', function onMouseLeave() {
	                isMouseOn = false;
	            });
	            angular.element($window).on('click', function onClickWindow() {
	                if (!isMouseOnInput && !isMouseOn) {
	                    hideCalender();
	                }
	            });
	            $scope.$watch('initDate', function (newVal, oldVal) {
	                if (isValidDate(newVal)) {
	                    resetDateTime();
	                }
	            });

	            resetDateTime();
	            thisInput.after(mainView);
	        }

	        return {
	            restrict: 'AE',
	            scope: {
	                initDate: '=',
	                dateMaxLimit: '=',
	                dateMinLimit: '='
	            },
	            link: linkingFunction
	        };
	    }
	    angular.module(prefix + 'datepicker', []).directive('datepicker', ['$window', '$compile', '$filter', '$locale', '$timeout', datePickerDirective]);
	})(angular, navigator);

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by tangjianfeng on 2017/1/1.
	 */

	module.exports = {
	  prefix: 'tjf'
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by tangjianfeng on 2017/3/6.
	 */
	function getDateTime(date) {
	    var dateForm = [date.year, date.month, date.date];
	    return new Date(dateForm.join('-'));
	}

	function isValidDate(dateString) {
	    var dateTime = new Date(dateString),
	        date = dateTime.getDate();
	    return !isNaN(date);
	}

	module.exports = {
	    getDateTime: getDateTime, isValidDate: isValidDate
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by tangjianfeng on 2017/3/6.
	 */

	var timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000,
	    leftPad = __webpack_require__(8).leftPad,
	    millSecOfDay = 24 * 3600 * 1000;

	function getDates(endDayOfMonth) {
	    var days = endDayOfMonth.getDate(),
	        arr = [],
	        i = 0;
	    while (i++ < days) {
	        arr.push(i);
	    }
	    return arr;
	}

	function getPrevDates(startDayOfMonth, endDayOfPrevMonth) {
	    var prevDays = startDayOfMonth.getDay();
	    if (prevDays !== 0) {
	        var arr = [],
	            endDate = endDayOfPrevMonth.getDate();
	        while (prevDays--) {
	            arr.unshift(endDate);
	            endDate--;
	        }
	        return arr;
	    }
	    return [];
	}

	function getNextDates(endDayOfMonth) {
	    var nextDays = 6 - endDayOfMonth.getDay();
	    if (nextDays !== 0) {
	        var arr = [],
	            i = 0;
	        while (nextDays >= ++i) {
	            arr.push(i);
	        }
	        return arr;
	    }
	    return [];
	}

	function defineGap(thisDate) {
	    var year = thisDate.year,
	        month = thisDate.month;
	    var startDayOfMonth = new Date(new Date(year + '-' + leftPad(month, 2) + '-01').valueOf() + timeZoneOffset),
	        startDayOfNextMonth = month === 12 ? new Date(new Date(year + 1 + '-01-01').valueOf() + timeZoneOffset) : new Date(new Date(year + '-' + leftPad(month + 1, 2) + '-01').valueOf() + timeZoneOffset),
	        endDayOfPrevMonth = new Date(startDayOfMonth - millSecOfDay),
	        endDayOfMonth = new Date(startDayOfNextMonth - millSecOfDay);
	    return {
	        startDayOfMonth: startDayOfMonth,
	        startDayOfNextMonth: startDayOfNextMonth,
	        endDayOfPrevMonth: endDayOfPrevMonth,
	        endDayOfMonth: endDayOfMonth
	    };
	}

	function getDateViewArr(thisDate) {
	    var gapInfo = defineGap(thisDate);
	    var thisMonthDays = getDates(gapInfo.endDayOfMonth),
	        prevMonthDays = getPrevDates(gapInfo.startDayOfMonth, gapInfo.endDayOfPrevMonth),
	        nextMonthDays = getNextDates(gapInfo.endDayOfMonth);
	    return {
	        thisMonthDays: thisMonthDays,
	        prevMonthDays: prevMonthDays,
	        nextMonthDays: nextMonthDays
	    };
	}

	module.exports = {
	    getDateViewArr: getDateViewArr,
	    timeZoneOffset: timeZoneOffset
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by tangjianfeng on 2017/3/6.
	 */

	function leftPad(value, length, site) {
	    var tempStr = '';
	    if (!site) {
	        site = '0';
	    }
	    value = value.toString();
	    if (value.length < length) {
	        var left = length - value.length;
	        while (left > 0) {
	            tempStr += site;
	            left--;
	        }
	    }
	    tempStr += value;
	    return tempStr;
	}

	module.exports = {
	    leftPad: leftPad
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "<div ng-model=\"a\" class=\"calender\">\n    <div class=\"calender-header\">\n        <span class=\"calender-header-left\" ng-class=\"{'disabled': overMin}\" ng-click=\"prev()\">上一页</span>\n        <span class=\"calender-header-middle\" ng-click=\"upSelect()\">{{selectedView}}</span>\n        <span class=\"calender-header-right\" ng-class=\"{'disabled': overMax}\" ng-click=\"next()\">下一页</span>\n    </div>\n    <div id=\"date-picker-switch\"></div>\n</div>";

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div id=\"date-picker-switch\" >\n    <div class=\"calender-day-header\">\n        <span class=\"day\" ng-repeat=\"day in days\">{{day}}</span>\n    </div>\n    <div class=\"calender-body\">\n        <span class=\"calender-date preNextMonth\" ng-repeat=\"date in prevDates\">{{date}}</span>\n        <span class=\"calender-date\" ng-repeat=\"date in dates\"\n              ng-class=\"{'active':dateTime.date===date&&dateTime.month===glanceView.month&&dateTime.year===glanceView.year,'disabled':isOverMinDate(date)||isOverMaxDate(date)}\"\n              ng-click=\"setDate(date)\">{{date}}</span>\n        <span class=\"calender-date preNextMonth\" ng-repeat=\"date in nextDates\">{{date}}</span>\n    </div>\n</div>";

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<div id=\"date-picker-switch\">\n    <div class=\"calender-body\">\n    <span class=\"calender-month\" ng-repeat=\"month in months\"\n          ng-class=\"{'active': dateTime.month===$index+1&&dateTime.year===glanceView.year, 'disabled':isOverMaxMonth($index+1)||isOverMinMonth($index+1)}\"\n          ng-click=\"setMonth($index+1)\">{{month}}</span>\n    </div>\n</div>";

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "<div id=\"date-picker-switch\">\n    <div class=\"calender-body\">\n        <span class=\"calender-year\"\n              ng-repeat=\"year in years\" ng-class=\"{'active':dateTime.year===year,'disabled':year>maxYear||year<minYear}\"\n              ng-click=\"setYear(year)\">{{year}}</span>\n    </div>\n</div>";

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Created by tangjianfeng on 2017/3/6.
	 */

	var maxYear = void 0,
	    maxMonth = void 0,
	    maxDate = void 0,
	    maxLimitDate = void 0;
	function init($scope, maxLimit) {
	    if (maxLimit) {
	        maxLimitDate = maxLimit;
	        $scope.maxYear = maxYear = maxLimitDate.getFullYear();
	        $scope.maxMonth = maxMonth = maxLimitDate.getMonth() + 1;
	        $scope.maxDate = maxDate = maxLimitDate.getDate();
	    } else {
	        //  需重置，否则数据会因闭包封存起来导致错误
	        maxLimitDate = {};
	        $scope.maxYear = maxYear = void 0;
	        $scope.maxMonth = maxMonth = void 0;
	        $scope.maxDate = maxDate = void 0;
	    }
	}

	function year(glanceView) {
	    if (!maxLimitDate) {
	        return false;
	    }
	    return glanceView.year >= maxYear;
	}

	function month(glanceView, month) {
	    if (!year(glanceView)) {
	        return false; // 可以排除掉无限制的情况
	    } else {
	        if (month) {
	            return glanceView.year * 100 + month > maxYear * 100 + maxMonth;
	        } else {
	            return glanceView.year * 100 + glanceView.month >= maxYear * 100 + maxMonth;
	        }
	    }
	}

	function date(glanceView, date) {
	    if (!month(glanceView)) {
	        return false;
	    } else {
	        if (date) {
	            return glanceView.year * 10000 + glanceView.month * 100 + date > maxYear * 10000 + maxMonth * 100 + maxDate;
	        } else {
	            return glanceView.year * 10000 + glanceView.month * 100 + glanceView.date >= maxYear * 10000 + maxMonth * 100 + maxDate;
	        }
	    }
	}

	module.exports = {
	    year: year,
	    month: month,
	    date: date,
	    init: init
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by tangjianfeng on 2017/3/6.
	 */

	var minYear = void 0,
	    minMonth = void 0,
	    minDate = void 0;
	function init($scope, minLimitDate) {
	    !minLimitDate ? minLimitDate = new Date(0) : '';
	    $scope.minYear = minYear = minLimitDate.getFullYear();
	    $scope.minMonth = minMonth = minLimitDate.getMonth() + 1;
	    $scope.minDate = minDate = minLimitDate.getDate();
	}

	function year(glanceView) {
	    return glanceView.year <= minYear;
	}

	function month(glanceView, month) {
	    if (!year(glanceView)) {
	        return false;
	    } else {
	        if (month) {
	            return glanceView.year * 10000 + month < minYear * 10000 + minMonth;
	        } else {
	            return glanceView.year * 10000 + glanceView.month <= minYear * 10000 + minMonth;
	        }
	    }
	}

	function date(glanceView, date) {
	    if (!month(glanceView)) {
	        return false;
	    } else {
	        if (date) {
	            return glanceView.year * 10000 + glanceView.month * 100 + date < minYear * 10000 + minMonth * 100 + minDate;
	        } else {
	            return glanceView.year * 10000 + glanceView.month * 100 + glanceView.date <= minYear * 10000 + minMonth * 100 + minDate;
	        }
	    }
	}

	module.exports = {
	    year: year,
	    month: month,
	    date: date,
	    init: init
	};

/***/ }
/******/ ]);