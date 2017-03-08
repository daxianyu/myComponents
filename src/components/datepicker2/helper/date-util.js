/**
 * Created by tangjianfeng on 2017/3/6.
 */
function getDateTime (date) {
    let dateForm = [date.year, date.month, date.date];
    return new Date(dateForm.join('-'));
}

function isValidDate (dateString) {
    let dateTime = new Date(dateString),
        date = dateTime.getDate();
    return !isNaN(date);
}

module.exports = {
    getDateTime, isValidDate,
};
