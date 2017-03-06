/**
 * Created by tangjianfeng on 2017/3/6.
 */

let maxYear, maxMonth, maxDate, maxLimitDate;
function init ($scope, maxLimit) {
    if (maxLimit) {
        maxLimitDate = maxLimit;
        maxYear = maxLimitDate.getFullYear();
        maxMonth = maxLimitDate.getMonth() + 1;
        maxDate = maxLimitDate.getDate();
        $scope.maxYear = maxYear;
        $scope.maxMonth = maxMonth;
        $scope.maxDate = maxDate;
    }
}

function year (glanceView) {
    if (!maxLimitDate) {
        return false;
    }
    return glanceView.year >= maxYear;
}

function month (glanceView, month) {
    if (!year(glanceView)) {
        return false;   // 可以排除掉无限制的情况
    } else {
        if (month) {
            return glanceView.year * 100 + month > maxYear * 100 + maxMonth;
        } else {
            return glanceView.year * 100 + glanceView.month >= maxYear * 100 + maxMonth;
        }
    }
}

function date (glanceView, date) {
    if (!month(glanceView)) {
        return false;
    } else {
        if (date) {
            return glanceView.year * 10000 + glanceView.month * 100 + date > maxYear *
                10000 + maxMonth * 100 + maxDate;
        } else {
            return glanceView.year * 10000 + glanceView.month * 100 +
                glanceView.date >= maxYear * 10000 + maxMonth * 100 + maxDate;
        }
    }
}

module.exports = {
    year: year,
    month: month,
    date: date,
    init: init,
};
