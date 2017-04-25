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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(16);

	/**
	 * Created by tangjianfeng on 2017/4/22.
	 */

	var angular = window.angular,
	    prefix = __webpack_require__(5).prefix;

	(function widthAngular(angular) {
	    'use strict';

	    function paginationComponent() {
	        var prevSymbol = -999,
	            nextSymbol = -998;

	        function compile(current) {
	            var vm = this,
	                i = 0,
	                pageNum = Math.ceil(vm.total / vm.pageSize);
	            current = current || 1;
	            vm.showList = [];
	            if (vm.maxPageNumber < 7) {
	                throw new Error('maxPageNumber should not less than 7!');
	            }
	            if (pageNum <= vm.maxPageNumber) {
	                while (++i <= pageNum) {
	                    vm.showList.push({
	                        number: i,
	                        active: current === i
	                    });
	                }
	            } else {
	                var middleNum = vm.maxPageNumber - 4,
	                    left = Math.floor((middleNum - 1) / 2),
	                    right = Math.floor(middleNum / 2);

	                vm.showList.push({
	                    number: ++i,
	                    active: current === 1
	                });
	                // first part
	                if (current - left > 2) {
	                    // 如果left部分 与队首不重叠
	                    if (current - left < 4) {
	                        // 1...3 的情况 变成123
	                        i++;
	                    } else {
	                        vm.showList.push({
	                            number: prevSymbol,
	                            active: false
	                        });
	                        if (pageNum - current < right + 2) {
	                            // 如果与队尾有重叠，会导致整个长度不到max
	                            i = pageNum - (vm.maxPageNumber - 3); // 前进到 减去队首两个和队尾一个之后的位置
	                        } else {
	                            i = current - left; // 前进到 正常的左位置
	                        }
	                    }
	                    for (; i <= current && i < pageNum; i++) {
	                        // 完成左半部分
	                        vm.showList.push({
	                            number: i,
	                            active: current === i
	                        });
	                    }
	                } else {
	                    // 如果left部分 与队首重叠则直接加到最后留个队尾为止
	                    while (++i <= vm.maxPageNumber - 2) {
	                        // 如果不加到队尾，那么就得写一遍等长逻辑
	                        vm.showList.push({
	                            number: i,
	                            active: current === i
	                        });
	                    }
	                }
	                // second part
	                if (pageNum - current >= right + 3) {
	                    // 与队尾不重叠
	                    for (; i <= current + right; i++) {
	                        vm.showList.push({
	                            number: i,
	                            active: current === i
	                        });
	                    }
	                    vm.showList.push({
	                        number: nextSymbol,
	                        active: false
	                    });
	                } else {
	                    // 与队尾重叠
	                    for (; i < pageNum; i++) {
	                        vm.showList.push({
	                            number: i,
	                            active: current === i
	                        });
	                    }
	                }
	                vm.showList.push({
	                    number: pageNum,
	                    active: current === pageNum
	                });
	            }
	        }

	        function controller($scope, $timeout) {
	            var vm = this;
	            vm.total = vm.total || 0;
	            vm.maxPageNumber = vm.maxPageNumber || 7;
	            vm.pageSize = vm.pageSize || 10;
	            vm.page = vm.page || 1;

	            vm.choose = function (i) {
	                var pageNum = Math.ceil(this.total / this.pageSize);
	                if (i > 0 && i <= pageNum) {
	                    this.page = i;
	                } else if (i === prevSymbol) {
	                    this.page = this.page - 3;
	                } else if (i === nextSymbol) {
	                    this.page = this.page + 3;
	                } else {
	                    return;
	                }
	                this._compile(this.page);
	                $timeout(function () {
	                    vm.change();
	                }, 0);
	            };
	            vm.prev = function () {
	                this.choose(this.page - 1);
	            };
	            vm.next = function () {
	                this.choose(this.page + 1);
	            };
	            vm.enter = function (event) {
	                if (event.charCode === 13) {
	                    var page = parseInt(this._page, 10);
	                    if (page) {
	                        this.choose(page);
	                    }
	                }
	            };
	            vm._compile = compile;
	            vm.init = function () {
	                vm._compile();
	                $scope.$watch('total', function () {
	                    vm._compile(vm.page);
	                });
	                $scope.$watch('page', function () {
	                    vm._compile(vm.page);
	                });
	            };
	        }
	        controller.$inject = ['$scope', '$timeout'];
	        return {
	            bindings: {
	                total: '=', // total single item number
	                maxPageNumber: '<', // max amount of divided page
	                pageSize: '<', // single item in a page
	                page: '=', // current page number
	                change: '&'
	            },
	            template: __webpack_require__(18),
	            controller: controller,
	            controllerAs: 'vm'
	        };
	    }
	    angular.module(prefix + 'pagination', []).component('pagination', paginationComponent());
	})(angular);

/***/ },

/***/ 16:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 18:
/***/ function(module, exports) {

	module.exports = "<div ng-init=\"vm.init()\">\n    <ul class=\"paginationX\">\n        <li class=\"page-border page-btn\" ng-click=\"vm.prev()\">&lt;</li>\n        <li ng-class=\"{active: item.active}\" class=\"page-btn page-border\" ng-repeat=\"item in vm.showList\"\n            ng-click=\"vm.choose(item.number)\">{{item.number>-1?item.number:'...'}}</li>\n        <li class=\"page-border page-btn\" ng-click=\"vm.next()\">&gt;</li>\n        <li style=\"padding-top: 0;vertical-align: top;\">\n            <div>\n                前往<input class=\"page-border\" style=\"height: 30px;width: 50px\" type=\"number\"\n                       ng-model=\"vm._page\" ng-keypress=\"vm.enter($event)\">页\n            </div>\n        </li>\n    </ul>\n</div>\n";

/***/ },

/***/ 5:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by tangjianfeng on 2017/1/1.
	 */

	module.exports = {
	  prefix: 'tjf'
	};

/***/ }

/******/ });