/**
 * Created by tangjianfeng on 2017/3/6.
 */

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


module.exports = {
    leftPad,
};
