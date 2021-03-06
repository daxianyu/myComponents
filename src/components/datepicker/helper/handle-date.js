/**
 * Created by tangjianfeng on 2017/3/6.
 */

const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000,
    leftPad = require('../../utils').leftPad,
    millSecOfDay = 24 * 3600 * 1000;

function getDates (endDayOfMonth) {
    let days = endDayOfMonth.getDate(),
        arr = [],
        i = 0;
    while (i++ < days) {
        arr.push(i);
    }
    return arr;
}

function getPrevDates (startDayOfMonth, endDayOfPrevMonth) {
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

function getNextDates (endDayOfMonth) {
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

function defineGap (thisDate) {
    const year = thisDate.year,
        month = thisDate.month;
    let startDayOfMonth = new Date(new Date(`${year}-${leftPad(month, 2)}-01`).valueOf() + timeZoneOffset),
        startDayOfNextMonth = month === 12
            ? new Date(new Date(`${year + 1}-01-01`).valueOf() + timeZoneOffset)
            : new Date(new Date(`${year}-${leftPad(month + 1, 2)}-01`).valueOf() + timeZoneOffset),
        endDayOfPrevMonth = new Date(startDayOfMonth - millSecOfDay),
        endDayOfMonth = new Date(startDayOfNextMonth - millSecOfDay);
    return {
        startDayOfMonth,
        startDayOfNextMonth,
        endDayOfPrevMonth,
        endDayOfMonth,
    };
}

function getDateViewArr (thisDate) {
    const gapInfo = defineGap(thisDate);
    let thisMonthDays = getDates(gapInfo.endDayOfMonth),
        prevMonthDays = getPrevDates(gapInfo.startDayOfMonth, gapInfo.endDayOfPrevMonth),
        nextMonthDays = getNextDates(gapInfo.endDayOfMonth);
    return {
        thisMonthDays,
        prevMonthDays,
        nextMonthDays,
    };
}


module.exports = {
    getDateViewArr,
    timeZoneOffset
};
