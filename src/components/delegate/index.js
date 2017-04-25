/*
* dxy delegate 0.0.1
* todo:
* 1. init delegate with an element and eventType or handler
* 2. we can name a type of sign for confirm a element, and transfer to a uniform sign
* 3. any type of event have its own handler
* */

/*
* 1. multi listener
* */

let data = window.dataxxx = {

};

function Delegate(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (!el) {
        throw new Error('no such element!');
    }
    if (!el.delegateInstance) {
        return new Delegate.fn.Init(el);
    } else {
        return el.delegateInstance;
    }
}

Delegate.uuid = 0;

Delegate.fn = Delegate.prototype = {
    Init: function(el) {
        this.root = el;
        this.root.delegateInstance = this;
        this.elemData = {
            events: {},
        };
    },
    addEvent(eventType, el, callback, isBubble) {
        let event = this.elemData.events[eventType];
        if (!event) {
            this.root.addEventListener(eventType, this.handler);
            event = this.elemData.events[eventType] = [];
            event.delegateCount = 1;
        } else {
            event.delegateCount++;
        }
        event.push({
            type: eventType,
            selector: el,
            isBubble: isBubble,
            handler: callback,
        });
    },
    getHandlers(event) {
        let type = event.type,
            current = event.target,
            root = event.currentTarget,
            matches = [],
            eventSaved = root.delegateInstance.elemData.events[type],
            delegateCount;
        if (eventSaved) {
            delegateCount = eventSaved.delegateCount;
            for (; current !== root; current = current.parentNode) {
                for (let i = 0;i < delegateCount; i++) {
                    let handler = eventSaved[i],
                        elem = root.querySelectorAll(handler.selector);
                    elem.forEach((ele) => {
                        if (current === ele) {
                            matches.push({
                                elem: current,
                                handler: handler.handler,
                            });
                        }
                    });
                }
            }
        }
        return matches;
    },
    handler (event) {
        let matches = Delegate.fn.getHandlers.apply(this, arguments);
        matches.forEach((match) => {
            let handler = match.handler,
                elements = match.elem;
            handler.apply(elements, arguments);
        });
    },
    removeEvent (eventType, el, callback) {
        let event = this.elemData.events[eventType];
        if (event) {
            for (let index = 0; index < event.length; index++) {
                let innerEvent = event[index];
                if (innerEvent.selector === el) {
                    if (callback && callback === innerEvent.handler) {      // 因为这里如果用户只需要解除某个函数，就不必全部解除
                        event.splice(index, 1);
                        event.delegateCount--;
                        return;
                    }
                }
            }
            for (let index = 0; index < event.length; index++) {
                let innerEvent = event[index];
                if (innerEvent.selector === el) {
                    event.splice(index, 1);
                    event.delegateCount--;
                }
            }
        }
    },
    destroy() {
        this.root.removeEventListener('click', this.handler);
        delete this.root.delegateInstance;
    },
};
Delegate.fn.Init.prototype = Delegate.fn;

window.Delegate = Delegate;
module.exports = Delegate;

function maxSum(arr) {
    let max = 0, sum = 0, index = 0;
    for (let i = 0;i < arr.length;i++) {
        sum += arr[i];
        if (sum < 0) {
            sum = 0;
        }
        if (sum > max) {
            index = i;
            max = sum;
        }
    }
    // console.log(max, index);
    return max;
}

let a = [-1, 4, -2, 3, -2, 3];

function max(a) {
    let sum = 0, max = 0;
    for (let i = 0;i < a.length; i++) {
        let first = a.slice(0, i),
            second = a.slice(i + 1, a.length);
        sum = maxSum(first) + maxSum(second);
        if (sum > max) {
            max = sum;
        }
    }
    return max;
}

function multiMax (arr, k) {
    let temp = new Array(arr.length + 1);
    for (let i = 0;i < temp.length;i++) {
        let tt = new Array(arr.length);
        temp[i] = tt;
        // for (let j = 0;j < tt.length;j++) {
        //     tt[j] = 0;
        // }
    }
    temp[0][0] = 0;
    // for (let i = 0;i < temp.length;i++) {}
}

// console.log(max(a));


