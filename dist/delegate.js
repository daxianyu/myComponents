/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

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

	var data = window.dataxxx = {};

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
	    Init: function Init(el) {
	        this.root = el;
	        this.root.delegateInstance = this;
	        this.elemData = {
	            events: {}
	        };
	    },
	    addEvent: function addEvent(eventType, el, callback, isBubble) {
	        var event = this.elemData.events[eventType];
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
	            handler: callback
	        });
	    },
	    getHandlers: function getHandlers(event) {
	        var type = event.type,
	            current = event.target,
	            root = event.currentTarget,
	            matches = [],
	            eventSaved = root.delegateInstance.elemData.events[type],
	            delegateCount = void 0;
	        if (eventSaved) {
	            delegateCount = eventSaved.delegateCount;
	            for (; current !== root; current = current.parentNode) {
	                var _loop = function _loop(i) {
	                    var handler = eventSaved[i],
	                        elem = root.querySelectorAll(handler.selector);
	                    elem.forEach(function (ele) {
	                        if (current === ele) {
	                            matches.push({
	                                elem: current,
	                                handler: handler.handler
	                            });
	                        }
	                    });
	                };

	                for (var i = 0; i < delegateCount; i++) {
	                    _loop(i);
	                }
	            }
	        }
	        return matches;
	    },
	    handler: function handler(event) {
	        var _arguments = arguments;

	        var matches = Delegate.fn.getHandlers.apply(this, arguments);
	        matches.forEach(function (match) {
	            var handler = match.handler,
	                elements = match.elem;
	            handler.apply(elements, _arguments);
	        });
	    },
	    removeEvent: function removeEvent(eventType, el, callback) {
	        var event = this.elemData.events[eventType];
	        if (event) {
	            for (var index = 0; index < event.length; index++) {
	                var innerEvent = event[index];
	                if (innerEvent.selector === el) {
	                    if (callback && callback === innerEvent.handler) {
	                        // 因为这里如果用户只需要解除某个函数，就不必全部解除
	                        event.splice(index, 1);
	                        event.delegateCount--;
	                        return;
	                    }
	                }
	            }
	            for (var _index = 0; _index < event.length; _index++) {
	                var _innerEvent = event[_index];
	                if (_innerEvent.selector === el) {
	                    event.splice(_index, 1);
	                    event.delegateCount--;
	                }
	            }
	        }
	    },
	    destroy: function destroy() {
	        this.root.removeEventListener('click', this.handler);
	        delete this.root.delegateInstance;
	    }
	};
	Delegate.fn.Init.prototype = Delegate.fn;

	window.Delegate = Delegate;
	module.exports = Delegate;

	function maxSum(arr) {
	    var max = 0,
	        sum = 0,
	        index = 0;
	    for (var i = 0; i < arr.length; i++) {
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

	var a = [-1, 4, -2, 3, -2, 3];

	function max(a) {
	    var sum = 0,
	        max = 0;
	    for (var i = 0; i < a.length; i++) {
	        var first = a.slice(0, i),
	            second = a.slice(i + 1, a.length);
	        sum = maxSum(first) + maxSum(second);
	        if (sum > max) {
	            max = sum;
	        }
	    }
	    return max;
	}

	function multiMax(arr, k) {
	    var temp = new Array(arr.length + 1);
	    for (var i = 0; i < temp.length; i++) {
	        var tt = new Array(arr.length);
	        temp[i] = tt;
	        // for (let j = 0;j < tt.length;j++) {
	        //     tt[j] = 0;
	        // }
	    }
	    temp[0][0] = 0;
	    // for (let i = 0;i < temp.length;i++) {}
	}

	// console.log(max(a));

/***/ }
/******/ ]);