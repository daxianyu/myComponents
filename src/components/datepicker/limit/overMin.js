/**
 * Created by tangjianfeng on 2017/3/6.
 */

let minYear, minMonth, minDate;
function init ($scope, minLimitDate) {
    !minLimitDate ? minLimitDate = new Date(0) : '';
    $scope.minYear = minYear = minLimitDate.getFullYear();
    $scope.minMonth = minMonth = minLimitDate.getMonth() + 1;
    $scope.minDate = minDate = minLimitDate.getDate();
}

function year (glanceView) {
    return glanceView.year <= minYear;
}

function month (glanceView, month) {
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

function date (glanceView, date) {
    if (!month(glanceView)) {
        return false;
    } else {
        if (date) {
            return glanceView.year * 10000 + glanceView.month * 100 + date < minYear *
                10000 + minMonth * 100 + minDate;
        } else {
            return glanceView.year * 10000 + glanceView.month * 100 +
                glanceView.date <= minYear * 10000 + minMonth * 100 + minDate;
        }
    }
}

module.exports = {
    year: year,
    month: month,
    date: date,
    init: init,
};
