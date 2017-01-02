/**
 * Created by tangjianfeng on 2017/1/1.
 */
import "./style.scss";
var prefix = require("../../config").prefix;
var angular = require('angular');

(function withAngular(angular, navigator) {
    'use strict';
    let millSecOfDay = 24*3600*1000;
    var getTemplate = function getTemplate(body) {
        let mainHtml = `<div ng-model="a" class="calender">
            <div class="calender-header">
                <span class="calender-header-left" ng-class="{'disabled': overMin}" ng-click="prev()">上一页</span>
                <span class="calender-header-middle" ng-click="upSelect()">{{selectedView}}</span>
                <span class="calender-header-right" ng-class="{'disabled': overMax}" ng-click="next()">下一页</span>
            </div>
            <div id="date-picker-switch"></div>
            </div>`;
        return mainHtml
    }, getDates = function getDates(){
        let body = `<div id="date-picker-switch" ><div class="calender-day-header">
            <span class="day" ng-repeat="day in days">{{day}}</span>
            </div><div class="calender-body"><span class="calender-date preNextMonth" ng-repeat="date in prevDates">{{date}}</span>
            <span class="calender-date" ng-repeat="date in dates" ng-class="{'active':dateTime.date===date&&dateTime.month===dateTimeView.month&&dateTime.year===dateTimeView.year,'disabled':isOverMaxDay(date)||isOverMinMonth(date)}" ng-click="setDate(date)">{{date}}</span>
            <span class="calender-date preNextMonth" ng-repeat="date in nextDates">{{date}}</span>
            </div></div>`;
        return body
    }, getMonths = function getMonths(){
        let body = `<div id="date-picker-switch"><div class="calender-body">
            <span class="calender-month" ng-repeat="month in months" ng-class="{'active': dateTime.month===$index+1&&dateTime.year===dateTimeView.year, 'disabled':isOverMaxMonth($index+1)||isOverMinMonth($index+1)}" ng-click="setMonth($index+1)">{{month}}</span>
            </div></div>`;
        return body
    }, getYears = function getYears(){
        let body = `<div id="date-picker-switch"><div class="calender-body">
            <span class="calender-year" ng-repeat="year in years" ng-class="{'active':dateTime.year===year,'disabled':year>maxYear||year<minYear}" ng-click="setYear(year)">{{year}}</span>
            </div></div>`;
        return body
    }, datePickerDirective = function datePickerDirective($window, $compile, $filter, $locale, $timeout) {
        function linkingFunction($scope, elm, attr) {
            var thisInput = angular.element(elm[0].children[0]),
                $theCalender = angular.element(elm),
                theCalender = $theCalender[0],
                theMainView = $compile(getTemplate())($scope),
                dates = $compile(getDates())($scope),
                months = $compile(getMonths())($scope),
                years = $compile(getYears())($scope),
                nowTime = new Date(),
                dateFormats = $locale.DATETIME_FORMATS,
                tempTime = $scope.tempTime = {},
                maxLimitDate = $scope.dateMaxLimit?new Date($scope.dateMaxLimit):null,
                minLimitDate = $scope.dateMinLimit?new Date($scope.dateMinLimit):null;
            var isMouseOnInput = false,
                isMouseOn = false;
            var isOverMax = (function isOverMax() {
                if(maxLimitDate){
                    var maxYear = maxLimitDate.getFullYear(), maxMonth = maxLimitDate.getMonth()+1,maxDate = maxLimitDate.getDate();
                    $scope.maxYear = maxYear;$scope.maxMonth = maxMonth;$scope.maxDate = maxDate;
                }else{
                    var maxYear = Infinity, maxMonth = Infinity, maxDate = Infinity;
                    $scope.maxYear = $scope.maxMonth = $scope.maxDate = maxYear;
                }
                function year() {
                    return $scope.dateTimeView.year >= maxYear
                }
                function month(month) {
                    if(!year()){   //可以排除掉无限制的情况
                        return false
                    }else{
                        if(month){
                            return $scope.dateTimeView.year*1000+month > maxYear*1000+maxMonth
                        }else{
                            return $scope.dateTimeView.year*1000+$scope.dateTimeView.month >= maxYear*1000+maxMonth
                        }
                    }
                }
                $scope.isOverMaxMonth = month;
                function date(date) {
                    if(!month()){
                        return false
                    }else{
                        if(date){
                            return $scope.dateTimeView.year*100000+$scope.dateTimeView.month*100+date > maxYear*100000+maxMonth*100+maxDate
                        }else{
                            return $scope.dateTimeView.year*100000+$scope.dateTimeView.month*100+$scope.dateTimeView.date >= maxYear*100000+maxMonth*100+maxDate
                        }
                    }
                }
                $scope.isOverMaxDay = date;
                return {
                    year: year,
                    month: month,
                    date: date
                }
            })(), isOverMin = (function isOverMax() {
                minLimitDate?'':minLimitDate=new Date(0);
                let minYear = minLimitDate.getFullYear(), minMonth = minLimitDate.getMonth()+1,minDate = minLimitDate.getDate();
                $scope.minYear = minYear;$scope.minMonth = minMonth;$scope.minDate = minDate;
                function year() {
                    return $scope.dateTimeView.year <= minYear
                }
                function month(month) {
                    if(!year()){
                        return false
                    }else{
                        if(month){
                            return $scope.dateTimeView.year*1000+month < minYear*1000+minMonth
                        }else{
                            return $scope.dateTimeView.year*1000+$scope.dateTimeView.month <= minYear*1000+minMonth
                        }
                    }
                }
                $scope.isOverMinMonth = month;
                function date() {
                    if(!month()){
                        return false
                    }else{
                        if(date){
                            return $scope.dateTimeView.year*100000+$scope.dateTimeView.month*100+date > minYear*100000+minMonth*100+minDate
                        }else{
                            return $scope.dateTimeView.year*100000+$scope.dateTimeView.month*100+$scope.dateTimeView.date >= minYear*100000+minMonth*100+minDate
                        }
                    }
                }
                return {
                    year: year,
                    month: month,
                    date: date
                }
            })(), showCalender = function showCalender() {
                theCalender.classList.add('open');
                changeView.set(0);
            },  hideCalender = function hideCalender() {
                theCalender.classList.remove('open');
                tempTime.year = $scope.dateTimeView.year = $scope.dateTime.year;
                tempTime.month = $scope.dateTimeView.month = $scope.dateTime.month;
                tempTime.date = $scope.dateTimeView.date = $scope.dateTime.date;
            },  changeView, changeView2 = function ChangeView() {
                var calDateTime = (function calDateTime() {
                    let startDayOfMonth,startDayOfNextMonth,endDayOfPrevMonth,endDayOfMonth;
                    function renew() {
                        let dtv = $scope.dateTimeView;
                        let year = dtv.year?dtv.year:$scope.dateTime.year,
                            month = dtv.month?dtv.month:$scope.dateTime.month;
                        startDayOfMonth = new Date(`${year}-${month}-01`);
                        startDayOfNextMonth = month===12?new Date(`${year+1}-01-01`):new Date(`${year}-${month+1}-01`);
                        endDayOfPrevMonth = new Date(startDayOfMonth.getTime()-millSecOfDay);
                        endDayOfMonth = new Date(startDayOfNextMonth.getTime()-millSecOfDay);
                        return this
                    }
                    function getDates() {
                        let days = endDayOfMonth.getDate(),
                            arr = [], i = 0;
                        while(i++<days){arr.push(i)}
                        return arr
                    }
                    function getPrevDates() {
                        let prevDays = startDayOfMonth.getDay();
                        if(prevDays!==0){
                            let arr = [], endDate = endDayOfPrevMonth.getDate();
                            while(prevDays--){
                                arr.unshift(endDate);
                                endDate--;
                            }
                            return arr
                        }
                        return []
                    }
                    function getNextDates() {
                        let nextDays = 6 - endDayOfMonth.getDay();
                        if(nextDays!==0){
                            let arr = [], i=0;
                            while(nextDays>=++i){
                                arr.push(i)
                            }
                            return arr
                        }
                        return []
                    }
                    return {
                        renew: renew,
                        getDates: getDates,
                        getPrevDates: getPrevDates,
                        getNextDates: getNextDates
                    }
                })();
                let $preHeader = angular.element(theMainView[0].querySelector('.calender-header'));
                let index = 0, views = [{
                    name: 'date',
                    DOM: dates,
                    getTitle(){
                        return $scope.months[$scope.dateTimeView.month-1];
                    }, prev(){
                        let dtv = $scope.dateTimeView;
                        if(dtv.month===1){dtv.year-=1;dtv.month=12}else{dtv.month--}
                        this.replaceView();
                        $scope.selectedView = this.getTitle();
                    }, next(){
                        let dtv = $scope.dateTimeView;
                        if(dtv.month===12){dtv.year+=1;dtv.month=1}else{dtv.month++}
                        this.replaceView();
                        $scope.selectedView = this.getTitle();
                    }, replaceView(){
                        $scope.dates = calDateTime.renew().getDates();
                        $scope.prevDates = calDateTime.getPrevDates();
                        $scope.nextDates = calDateTime.getNextDates();
                        $scope.overMax = isOverMax.month();
                        $scope.overMin = isOverMin.month();
                    }
                }, {
                    name: 'month',
                    DOM: months,
                    getTitle(){return $scope.dateTimeView.year+'年'},
                    prev(){
                        $scope.dateTimeView.year--;
                        $scope.selectedView = this.getTitle();
                        this.replaceView();
                    },
                    next(){
                        $scope.dateTimeView.year++;
                        $scope.selectedView = this.getTitle();
                        this.replaceView();
                    },
                    replaceView(){
                        $scope.overMax = isOverMax.year();
                        $scope.overMin = isOverMin.year();
                    }
                }, {
                    name: 'year',
                    DOM: years,
                    getTitle(){return `${$scope.years[0]} - ${$scope.years[15]}`},
                    prev(){
                        let endYear = $scope.years[0]-1, i = 16, arr=[];
                        while (i--){
                            arr.push(endYear-i)
                        }
                        $scope.years = arr;
                        $scope.selectedView = this.getTitle();
                        this.replaceView();
                    },
                    next(){
                        let startYear = $scope.years[15], i = 0, arr=[];
                        while (i++<16){
                            arr.push(startYear+i)
                        }
                        $scope.years = arr;
                        $scope.selectedView = this.getTitle();
                        this.replaceView();
                    },
                    replaceView(){
                        let thisYear = $scope.dateTimeView.year, startYear = thisYear-11, endYear = thisYear + 5, arr = [];
                        while (startYear++<endYear){
                            arr.push(startYear)
                        }
                        $scope.years = arr;
                        $scope.overMax = arr[arr.length-1]>maxLimitDate.getFullYear();
                        $scope.overMin = arr[0]<minLimitDate.getFullYear();
                    }
                }];
                function switchView() {
                    let preBody = theMainView[0].querySelector('#date-picker-switch');
                    preBody.remove();
                    $preHeader.after(views[index].DOM);
                    views[index].replaceView();
                    $scope.selectedView = views[index].getTitle();
                }
                function upper() {
                    if(index<views.length-1){
                        index ++;
                        switchView()
                    }
                }
                function lower() {
                    if(index>0){
                        index--;
                        switchView()
                    }
                }
                function prev() {
                    views[index].prev();
                }
                function next() {
                    views[index].next();
                }
                function set(setIndex) {
                    if(setIndex>=0 && setIndex<views.length){
                        index = setIndex;
                        switchView()
                    }
                }
                thisInput.after(theMainView);
                switchView();
                return {
                    upper: upper,
                    lower: lower,
                    prev: prev,
                    next: next,
                    set: set
                }
            }, getDateTimeObj = function(date){
                let dateForm = [date.year, date.month, date.date];
                return new Date(dateForm.join('-'))
            }, isValidDate = function isValidDate(dateString) {
                let dateTime = new Date(dateString),
                    date = dateTime.getDate();
                // NaN !== NaN
                return date===date;
            }, resetDateTime = function resetDateTime() {
                $scope.dateTime = (function () {
                    let initTime = isValidDate($scope.initDate)?new Date($scope.initDate):nowTime;
                    return {
                        date: tempTime.date = initTime.getDate(),
                        month: tempTime.month = $scope.dateTimeView.month = initTime.getMonth() + 1,
                        year: tempTime.year = $scope.dateTimeView.year = initTime.getFullYear()
                    }
                })();
            };
            $scope.dateTimeView= {};
            $scope.open = false;
            $scope.days = dateFormats.SHORTDAY;
            $scope.months = dateFormats.SHORTMONTH;

            $scope.upSelect = function(){
                changeView.upper();
            };
            $scope.prev = function () {
                changeView.prev();
            };
            $scope.next = function () {
                changeView.next();
            };

            $scope.setDate = function (date) {
                let dtv = $scope.dateTimeView,dateString;
                date?dtv.date = date:'';

                tempTime.month = dtv.month;
                tempTime.date = dtv.date;

                $scope.dateTime.year = dtv.year;
                $scope.dateTime.month = dtv.month;
                $scope.dateTime.date = dtv.date;
                dateString = getDateTimeObj($scope.dateTime);

                thisInput.val($filter('date')(dateString, 'yyyy-MM-dd'));
                thisInput.triggerHandler('input');
                thisInput.triggerHandler('change');
                if(date){
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

            thisInput.on("click focus focusin", function clickAndFocus() {
                isMouseOnInput = true;
                if(!isMouseOnInput&&!isMouseOn){
                    hideCalender();
                }else{
                    $scope.$apply(function () {
                        showCalender();
                    })
                }
            });
            thisInput.on('blur focusout', function blur() {
                isMouseOnInput = false;
                // if(!isValidDate($scope.initDate)){
                //     $scope.setDate();
                // }
            });
            $theCalender.on("mouseenter", function onMouseEnter() {
                isMouseOn = true;
            });
            $theCalender.on("mouseleave", function onMouseLeave() {
                isMouseOn = false;
            });
            angular.element($window).on("click", function onClickWindow() {
                if(!isMouseOnInput && !isMouseOn){
                    hideCalender();
                }
            });
            $scope.$watch('initDate', function (newVal, oldVal) {
                if(isValidDate(newVal)){
                    resetDateTime()
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
                dateMaxLimit: '@',
                dateMinLimit: '@'
            },
            link: linkingFunction
        }
    };
    angular.module(prefix + 'datepicker', [])
        .directive("datePicker", ['$window', '$compile', '$filter', '$locale', '$timeout', datePickerDirective])
}(angular, navigator));