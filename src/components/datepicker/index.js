/**
 * Created by tangjianfeng on 2017/1/1.
 */
/* global require, navigator */

/*
* timeZoneOffset拿来补偿
* 因时区的原因导致的在new Date('2017-01-01')时，
* 与格林尼治时间的差
* */

let angular = window.angular,
    prefix = require('../../config').prefix;
import './style.scss';

(function withAngular (angular, navigator) {
    'use strict';
    const dateViewIndex = 0,
        monthViewIndex = 1,
        yearViewIndex = 2,
        dateUtil = require('./helper/date-util'),
        calDateTime = require('./helper/handle-date'),
        getDateTime = dateUtil.getDateTime,
        isValidDate = dateUtil.isValidDate;

    let mainViewHtml = require('./template/index.html'),
        dateViewHtml = require('./template/dates.html'),
        monthViewHtml = require('./template/months.html'),
        yearViewHtml = require('./template/years.html');

    function datePickerDirective ($window, $compile, $filter, $locale, $timeout) {
        // 记录两个日期：一个是上次改后的日期，一个是记录浏览过程中的当前页日期信息
        // 作水平切换时，只有上次改后的日期所在的年、月、日才作active显示
        function linkingFunction ($scope, elm, attr) {
            const isOverMax = require('./limit/overMax'),
                isOverMin = require('./limit/overMin');
            let thisInput = angular.element(elm[0].children[0]),
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
                minLimitDate = $scope.dateMinLimit ? new Date($scope.dateMinLimit) : new Date(0),  // 如果没有设定最小，则为1970年
                changeView,
                isMouseOnInput = false,
                isMouseOn = false;

            $scope.dateTime = {};           // 上次改后的日期
            $scope.glanceView = {};         // 浏览过程中的当前页日期信息

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

            function resetLimit () {                    // 重置最大小日期限制
                maxLimitDate = $scope.dateMaxLimit ? new Date($scope.dateMaxLimit) : null;
                minLimitDate = $scope.dateMinLimit ? new Date($scope.dateMinLimit) : new Date(0);
            }

            function resetDateTime () {                 // 初始化重置日期或当手工修改input时重置
                let initTime = isValidDate($scope.initDate)
                    ? new Date(new Date($scope.initDate).valueOf() + calDateTime.timeZoneOffset)
                    : nowTime;
                $scope.dateTime = {
                    date: initTime.getDate(),
                    month: $scope.glanceView.month = initTime.getMonth() + 1,
                    year: $scope.glanceView.year = initTime.getFullYear(),
                };
            }

            function showCalender () {                  // 点击弹出选择器时触发，一系列重置
                theCalender.classList.add('open');
                resetLimit();                           // 因为如果start-date和end-date联动相互制约，则需要每次都init
                isOverMax.init($scope, maxLimitDate);
                isOverMin.init($scope, minLimitDate);
                $scope.glanceView.year = $scope.dateTime.year;
                $scope.glanceView.month = $scope.dateTime.month;
                $scope.glanceView.date = $scope.dateTime.date;
                changeView.set(dateViewIndex); // reset to dateView
            }

            function hideCalender () {
                theCalender.classList.remove('open');
            }

            // 封装选择器视图操作
            changeView = (function changeView2 () {
                let $preHeader = angular.element(mainView[0].querySelector('.calender-header')),
                    viewIndex = 0,
                    dateViewObj = {
                        name: 'date',
                        DOM: dateView,
                        getTitle () {
                            return $scope.months[$scope.glanceView.month - 1];
                        },
                        prev () {
                            let dtv = $scope.glanceView;
                            if (dtv.month === 1) {
                                dtv.year -= 1;
                                dtv.month = 12;
                            } else {
                                dtv.month--;
                            }
                            this.replaceView();
                        },
                        next () {
                            let dtv = $scope.glanceView;
                            if (dtv.month === 12) {
                                dtv.year += 1;
                                dtv.month = 1;
                            } else {
                                dtv.month++;
                            }
                            this.replaceView();
                        },
                        replaceView () {
                            let dateViewArr = calDateTime.getDateViewArr($scope.glanceView);
                            $scope.dates = dateViewArr.thisMonthDays;
                            $scope.prevDates = dateViewArr.prevMonthDays;
                            $scope.nextDates = dateViewArr.nextMonthDays;

                            $scope.overMax = $scope.isOverMaxMonth();
                            $scope.overMin = $scope.isOverMinMonth();
                            $scope.selectedView = this.getTitle();
                        },
                    }, monthViewObj = {
                        name: 'month',
                        DOM: monthView,
                        getTitle () {
                            return $scope.glanceView.year + '年';
                        },
                        prev () {
                            $scope.glanceView.year--;
                            this.replaceView();
                        },
                        next () {
                            $scope.glanceView.year++;
                            this.replaceView();
                        },
                        replaceView () {
                            $scope.overMax = $scope.isOverMaxYear();
                            $scope.overMin = $scope.isOverMinYear();
                            $scope.selectedView = this.getTitle();
                        },
                    }, yearViewObj = {
                        name: 'year',
                        DOM: yearsView,
                        getTitle () {
                            return `${$scope.years[0]} - ${$scope.years[15]}`;
                        },
                        prev () {
                            let endYear = $scope.years[0] - 1, i = 16, arr = [];
                            while (i--) {
                                arr.push(endYear - i);
                            }
                            $scope.years = arr;
                            this.replaceView(true);
                        },
                        next () {
                            let startYear = $scope.years[15], i = 0, arr = [];
                            while (i++ < 16) {
                                arr.push(startYear + i);
                            }
                            $scope.years = arr;
                            this.replaceView(true);
                        },
                        replaceView (flag) {
                            let arr = [];
                            if (!flag) {
                                let thisYear = $scope.glanceView.year, startYear = thisYear - 11, endYear = thisYear + 5;
                                while (startYear++ < endYear) {
                                    arr.push(startYear);
                                }
                                $scope.years = arr;
                            }
                            $scope.overMax = maxLimitDate ? $scope.years[$scope.years.length - 1] > maxLimitDate.getFullYear() : false;
                            $scope.overMin = $scope.years[0] < minLimitDate.getFullYear();
                            $scope.selectedView = this.getTitle();
                        },
                    },
                    views = [dateViewObj, monthViewObj, yearViewObj];

                function switchView () {
                    let preBody = mainView[0].querySelector('#date-picker-switch');
                    preBody.remove();
                    $preHeader.after(views[viewIndex].DOM);
                    views[viewIndex].replaceView();
                }
                function upward () {
                    if (viewIndex < views.length - 1) {
                        viewIndex++;
                        switchView();
                    }
                }
                function downward () {
                    if (viewIndex > 0) {
                        viewIndex--;
                        switchView();
                    }
                }
                function prev () {
                    views[viewIndex].prev();
                }
                function next () {
                    views[viewIndex].next();
                }
                function set (index) {
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
                    downward: downward,
                };
            })();

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
                let dtv = $scope.glanceView,
                    resultDateTime;
                date ? dtv.date = date : '';
                $scope.dateTime.year = dtv.year;
                $scope.dateTime.month = dtv.month;
                $scope.dateTime.date = dtv.date;
                resultDateTime = getDateTime($scope.dateTime);
                thisInput.val($filter('date')(resultDateTime, 'yyyy-MM-dd'));
                thisInput.triggerHandler('input');      // 最后触发一下事件，让angular执行循环
                thisInput.triggerHandler('change');
                if (date) {
                    hideCalender();
                }
            };

            // 标记鼠标位置，来选择执行什么事件
            thisInput.on('click focus focusin', function clickAndFocus () {
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
            thisInput.on('blur focusout', function blur () {
                isMouseOnInput = false;
            });
            $theCalender.on('mouseenter', function onMouseEnter () {
                isMouseOn = true;
            });
            $theCalender.on('mouseleave', function onMouseLeave () {
                isMouseOn = false;
            });
            angular.element($window).on('click', function onClickWindow () {
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
                dateMinLimit: '=',
            },
            link: linkingFunction,
        };
    }
    angular.module(prefix + 'datepicker', [])
        .directive('datepicker', ['$window', '$compile', '$filter', '$locale', '$timeout', datePickerDirective]);
}(angular, navigator));
