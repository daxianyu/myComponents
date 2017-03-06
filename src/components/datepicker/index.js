/**
 * Created by tangjianfeng on 2017/1/1.
 */
/* global require, navigator */

let angular = require('ng'),
    prefix = require('../../config').prefix;
import './style.scss';

(function withAngular (angular, navigator) {
    'use strict';
    let millSecOfDay = 24 * 3600 * 1000;
    function leftPad (value, length, site) {
        let tempStr = '';
        if (!site) {
            site = '0';
        }
        value = value.toString();
        if (value.length < length) {
            let left = length - value.length;
            while (left > 0) {
                tempStr += site;
                left--;
            }
        }
        tempStr += value;
        return tempStr;
    }
    function getTemplate () {
        return require('./template/index.html');
    }
    function getDates () {
        return require('./template/dates.html');
    }
    function getMonths () {
        return require('./template/months.html');
    }
    function getYears () {
        return require('./template/years.html');
    }

    function datePickerDirective ($window, $compile, $filter, $locale, $timeout) {
        function linkingFunction ($scope, elm, attr) {
            let thisInput = angular.element(elm[0].children[0]),
                $theCalender = angular.element(elm),
                theCalender = $theCalender[0],
                theMainView = $compile(getTemplate())($scope),
                dates = $compile(getDates())($scope),
                months = $compile(getMonths())($scope),
                years = $compile(getYears())($scope),
                nowTime = new Date(),
                dateFormats = $locale.DATETIME_FORMATS,
                tempTime = $scope.tempTime = {},
                maxLimitDate = $scope.dateMaxLimit ? new Date($scope.dateMaxLimit) : null,
                minLimitDate = $scope.dateMinLimit ? new Date($scope.dateMinLimit) : null,
                isOverMax,
                isOverMin,
                changeView,
                isMouseOnInput = false,
                isMouseOn = false;
            function resetYear () {
                maxLimitDate = $scope.dateMaxLimit ? new Date($scope.dateMaxLimit) : null;
                minLimitDate = $scope.dateMinLimit ? new Date($scope.dateMinLimit) : null;
            }
            function showCalender () {
                theCalender.classList.add('open');
                isOverMax.set();
                isOverMin.set();
                changeView.set(0); // reset to dateView
            }
            function hideCalender () {
                theCalender.classList.remove('open');
                tempTime.year = $scope.dateTimeView.year = $scope.dateTime.year;
                tempTime.month = $scope.dateTimeView.month = $scope.dateTime.month;
                tempTime.date = $scope.dateTimeView.date = $scope.dateTime.date;
            }
            function changeView2 () {
                var calDateTime = (function calDateTime () {
                    let startDayOfMonth,
                        startDayOfNextMonth,
                        endDayOfPrevMonth,
                        endDayOfMonth;

                    function renew () {
                        let dtv = $scope.dateTimeView,
                            year = dtv.year ? dtv.year : $scope.dateTime.year,
                            month = dtv.month ? dtv.month : $scope.dateTime.month;
                        startDayOfMonth = new Date(`${year}-${leftPad(month, 2)}-01`);
                        startDayOfNextMonth = month === 12 ? new Date(`${year + 1}-01-01`)
                            : new Date(`${year}-${leftPad(month + 1, 2)}-01`);
                        endDayOfPrevMonth = new Date(startDayOfMonth.getTime() - millSecOfDay);
                        endDayOfMonth = new Date(startDayOfNextMonth.getTime() - millSecOfDay);
                        return this;
                    }

                    function getDates () {
                        let days = endDayOfMonth.getDate(),
                            arr = [],
                            i = 0;
                        while (i++ < days) {
                            arr.push(i);
                        }
                        return arr;
                    }

                    function getPrevDates () {
                        let prevDays = startDayOfMonth.getDay();
                        if (prevDays !== 0) {
                            let arr = [],
                                endDate = endDayOfPrevMonth.getDate();
                            while (prevDays--) {
                                arr.unshift(endDate);
                                endDate--;
                            }
                            return arr;
                        }
                        return [];
                    }

                    function getNextDates () {
                        let nextDays = 6 - endDayOfMonth.getDay();
                        if (nextDays !== 0) {
                            let arr = [], i = 0;
                            while (nextDays >= ++i) {
                                arr.push(i);
                            }
                            return arr;
                        }
                        return [];
                    }

                    return {
                        renew: renew,
                        getDates: getDates,
                        getPrevDates: getPrevDates,
                        getNextDates: getNextDates,
                    };
                })();

                let calDateTime2 = require('./handle-date');


                let $preHeader = angular.element(theMainView[0].querySelector('.calender-header')),
                    index = 0,
                    views = [
                        {
                            name: 'date',
                            DOM: dates,
                            getTitle () {
                                return $scope.months[$scope.dateTimeView.month - 1];
                            }, prev () {
                                let dtv = $scope.dateTimeView;
                                if (dtv.month === 1) {
                                    dtv.year -= 1;
                                    dtv.month = 12;
                                } else {
                                    dtv.month--;
                                }
                                this.replaceView();
                                $scope.selectedView = this.getTitle();
                            }, next () {
                                let dtv = $scope.dateTimeView;
                                if (dtv.month === 12) {
                                    dtv.year += 1;
                                    dtv.month = 1;
                                } else {
                                    dtv.month++;
                                }
                                this.replaceView();
                                $scope.selectedView = this.getTitle();
                            }, replaceView () {
                                $scope.dates = calDateTime.renew().getDates();
                                $scope.prevDates = calDateTime.getPrevDates();
                                $scope.nextDates = calDateTime.getNextDates();
                                $scope.overMax = isOverMax.month();
                                $scope.overMin = isOverMin.month();
                            },
                        }, {
                            name: 'month',
                            DOM: months,
                            getTitle () {
                                return $scope.dateTimeView.year + '年';
                            },
                            prev () {
                                $scope.dateTimeView.year--;
                                $scope.selectedView = this.getTitle();
                                this.replaceView();
                            },
                            next () {
                                $scope.dateTimeView.year++;
                                $scope.selectedView = this.getTitle();
                                this.replaceView();
                            },
                            replaceView () {
                                $scope.overMax = isOverMax.year();
                                $scope.overMin = isOverMin.year();
                            },
                        }, {
                            name: 'year',
                            DOM: years,
                            getTitle () {
                                return `${$scope.years[0]} - ${$scope.years[15]}`;
                            },
                            prev () {
                                let endYear = $scope.years[0] - 1, i = 16, arr = [];
                                while (i--) {
                                    arr.push(endYear - i);
                                }
                                $scope.years = arr;
                                $scope.selectedView = this.getTitle();
                                this.replaceView(true);
                            },
                            next () {
                                let startYear = $scope.years[15], i = 0, arr = [];
                                while (i++ < 16) {
                                    arr.push(startYear + i);
                                }
                                $scope.years = arr;
                                $scope.selectedView = this.getTitle();
                                this.replaceView(true);
                            },
                            replaceView (flag) {
                                let arr = [];
                                if (!flag) {
                                    let thisYear = $scope.dateTimeView.year, startYear = thisYear - 11, endYear = thisYear + 5;
                                    while (startYear++ < endYear) {
                                        arr.push(startYear);
                                    }
                                    $scope.years = arr;
                                }
                                $scope.overMax = maxLimitDate ? $scope.years[$scope.years.length - 1] > maxLimitDate.getFullYear() : false;
                                $scope.overMin = $scope.years[0] < minLimitDate.getFullYear();
                            },
                        },
                    ];

                function switchView () {
                    let preBody = theMainView[0].querySelector('#date-picker-switch');
                    preBody.remove();
                    $preHeader.after(views[index].DOM);
                    views[index].replaceView();
                    $scope.selectedView = views[index].getTitle();
                }

                function upper () {
                    if (index < views.length - 1) {
                        index++;
                        switchView();
                    }
                }

                function lower () {
                    if (index > 0) {
                        index--;
                        switchView();
                    }
                }

                function prev () {
                    views[index].prev();
                }

                function next () {
                    views[index].next();
                }

                function set (setIndex) {
                    if (setIndex >= 0 && setIndex < views.length) {
                        index = setIndex;
                        switchView();
                    }
                }

                thisInput.after(theMainView);
                switchView();
                return {
                    upper: upper,
                    lower: lower,
                    prev: prev,
                    next: next,
                    set: set,
                };
            }
            function getDateTimeObj (date) {
                let dateForm = [date.year, date.month, date.date];
                return new Date(dateForm.join('-'));
            }
            function isValidDate (dateString) {
                let dateTime = new Date(dateString),
                    date = dateTime.getDate();
                // NaN !== NaN
                return !isNaN(date);
            }
            function resetDateTime () {
                $scope.dateTime = (function () {
                    let initTime = isValidDate($scope.initDate) ? new Date($scope.initDate) : nowTime;
                    return {
                        date: tempTime.date = initTime.getDate(),
                        month: tempTime.month = $scope.dateTimeView.month = initTime.getMonth() + 1,
                        year: tempTime.year = $scope.dateTimeView.year = initTime.getFullYear(),
                    };
                })();
            }

            isOverMax = (function isOverMax () {
                let maxYear, maxMonth, maxDate;
                function set () {
                    if (maxLimitDate) {
                        resetYear();
                        maxYear = maxLimitDate.getFullYear();
                        maxMonth = maxLimitDate.getMonth() + 1;
                        maxDate = maxLimitDate.getDate();
                        $scope.maxYear = maxYear;
                        $scope.maxMonth = maxMonth;
                        $scope.maxDate = maxDate;
                    }
                }

                function year () {
                    if (!maxLimitDate) {
                        return false;
                    }
                    return $scope.dateTimeView.year >= maxYear;
                }

                function month (month) {
                    if (!year()) {
                        return false;   // 可以排除掉无限制的情况
                    } else {
                        if (month) {
                            return $scope.dateTimeView.year * 100 + month > maxYear * 100 + maxMonth;
                        } else {
                            return $scope.dateTimeView.year * 100 + $scope.dateTimeView.month >= maxYear * 100 + maxMonth;
                        }
                    }
                }

                $scope.isOverMaxMonth = month;
                function date (date) {
                    if (!month()) {
                        return false;
                    } else {
                        if (date) {
                            return $scope.dateTimeView.year * 10000 + $scope.dateTimeView.month * 100 + date > maxYear *
                                10000 + maxMonth * 100 + maxDate;
                        } else {
                            return $scope.dateTimeView.year * 10000 + $scope.dateTimeView.month * 100 +
                                $scope.dateTimeView.date >= maxYear * 10000 + maxMonth * 100 + maxDate;
                        }
                    }
                }

                $scope.isOverMaxDay = date;
                set(); // initialize
                return {
                    year: year,
                    month: month,
                    date: date,
                    set: set,
                };
            })();
            isOverMin = (function isOverMax () {
                !minLimitDate ? minLimitDate = new Date(0) : '';
                let minYear, minMonth, minDate;

                function set () {
                    resetYear();
                    !minLimitDate ? minLimitDate = new Date(0) : '';
                    $scope.minYear = minYear = minLimitDate.getFullYear();
                    $scope.minMonth = minMonth = minLimitDate.getMonth() + 1;
                    $scope.minDate = minDate = minLimitDate.getDate();
                }

                function year () {
                    return $scope.dateTimeView.year <= minYear;
                }

                function month (month) {
                    if (!year()) {
                        return false;
                    } else {
                        if (month) {
                            return $scope.dateTimeView.year * 10000 + month < minYear * 10000 + minMonth;
                        } else {
                            return $scope.dateTimeView.year * 10000 + $scope.dateTimeView.month <= minYear * 10000 + minMonth;
                        }
                    }
                }

                $scope.isOverMinMonth = month;
                function date (date) {
                    if (!month()) {
                        return false;
                    } else {
                        if (date) {
                            return $scope.dateTimeView.year * 10000 + $scope.dateTimeView.month * 100 + date < minYear *
                                10000 + minMonth * 100 + minDate;
                        } else {
                            return $scope.dateTimeView.year * 10000 + $scope.dateTimeView.month * 100 +
                                $scope.dateTimeView.date <= minYear * 10000 + minMonth * 100 + minDate;
                        }
                    }
                }

                $scope.isOverMinDate = date;
                set();
                return {
                    year: year,
                    month: month,
                    date: date,
                    set: set,
                };
            })();

            $scope.dateTimeView = {};
            $scope.open = false;
            $scope.days = dateFormats.SHORTDAY;
            $scope.months = dateFormats.SHORTMONTH;

            $scope.upSelect = function () {
                changeView.upper();
            };
            $scope.prev = function () {
                changeView.prev();
            };
            $scope.next = function () {
                changeView.next();
            };

            $scope.setDate = function (date) {
                let dtv = $scope.dateTimeView,
                    dateString;
                date ? dtv.date = date : '';

                tempTime.month = dtv.month;
                tempTime.date = dtv.date;

                $scope.dateTime.year = dtv.year;
                $scope.dateTime.month = dtv.month;
                $scope.dateTime.date = dtv.date;
                dateString = getDateTimeObj($scope.dateTime);

                thisInput.val($filter('date')(dateString, 'yyyy-MM-dd'));
                thisInput.triggerHandler('input');
                thisInput.triggerHandler('change');
                if (date) {
                    hideCalender();
                }
            };
            $scope.setMonth = function (month) {
                $scope.dateTimeView.month = tempTime.month = month;
                tempTime.year = $scope.dateTimeView.year;
                changeView.lower();
            };
            $scope.setYear = function (year) {
                $scope.dateTimeView.year = tempTime.year = year;
                changeView.lower();
            };

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
            thisInput.on('blur focusout', function blur () {
                isMouseOnInput = false;
                // if(!isValidDate($scope.initDate)){
                //     $scope.setDate();
                // }
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
            changeView = changeView2();
            changeView.set(0);
        }

        return {
            restrict: 'AE',
            scope: {
                initDate: '=',
                dateMaxLimit: '=',
                dateMinLimit: '=',
                startDate: '=',
                endDate: '=',
            },
            link: linkingFunction,
        };
    }
    angular.module(prefix + 'datepicker', [])
        .directive('datepicker', ['$window', '$compile', '$filter', '$locale', '$timeout', datePickerDirective]);
}(angular, navigator));
