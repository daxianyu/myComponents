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

	/**
	 * Created by tangjianfeng on 2017/4/24.
	 */
	window.onload = function () {
	    var a = Delegate('#test'),
	        b = Delegate('#test2');

	    function handler(event) {
	        console.log(event);
	    }

	    function handler2(event) {
	        console.log(222);
	    }

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

/***/ }
/******/ ]);