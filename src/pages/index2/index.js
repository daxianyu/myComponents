/**
 * Created by tangjianfeng on 2017/4/24.
 */
window.onload = function () {
    let a = Delegate('#test'),
        b = Delegate('#test2');

    function handler(event) {console.log(event);}

    function handler2(event) {console.log(222);}

    a.addEvent('click', 'span', handler);
    a.addEvent('click', 'span', handler2);

    a.addEvent('click', 'span', function (event) {
        console.log(11);
    });

    b.addEvent('click', '#test', function () {
        console.log(11312312312);
    });

    a.removeEvent('click', 'span', handler);
    a.removeEvent('click', 'span', handler2);
};
