/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"www/js/build/dev/reactpages/exchangewl/exchangewl": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "www/js/build/dev/reactpages/lib/" + ({"xlsx-style-sparta":"xlsx-style-sparta"}[chunkId]||chunkId) + ".chunk.js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var head = document.getElementsByTagName('head')[0];
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./www/js/source/reactpages/pages/exchangewl/components/index.jsx","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cptable":
/*!**************************!*\
  !*** external "cptable" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = cptable;

/***/ }),

/***/ "./jszip":
/*!************************!*\
  !*** external "jszip" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jszip;

/***/ }),

/***/ "./ods":
/*!**********************!*\
  !*** external "ods" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ods;

/***/ }),

/***/ "./www/js/source/reactpages/actions/currencyAction.js":
/*!************************************************************!*\
  !*** ./www/js/source/reactpages/actions/currencyAction.js ***!
  \************************************************************/
/*! exports provided: setSelectedCurrency */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSelectedCurrency", function() { return setSelectedCurrency; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./www/js/source/reactpages/actions/types.js");

var setSelectedCurrency = function setSelectedCurrency(item) {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["SET_SELECTED_CURRENCY"],
    data: item
  };
};

/***/ }),

/***/ "./www/js/source/reactpages/actions/dateRangeAction.js":
/*!*************************************************************!*\
  !*** ./www/js/source/reactpages/actions/dateRangeAction.js ***!
  \*************************************************************/
/*! exports provided: setDateRange */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDateRange", function() { return setDateRange; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./www/js/source/reactpages/actions/types.js");

var setDateRange = function setDateRange(dateRange) {
  var range = {
    fromDate: dateRange.startDate,
    toDate: dateRange.endDate
  };
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["SET_DATE_RANGE"],
    data: range
  };
};

/***/ }),

/***/ "./www/js/source/reactpages/actions/excludeTestAction.js":
/*!***************************************************************!*\
  !*** ./www/js/source/reactpages/actions/excludeTestAction.js ***!
  \***************************************************************/
/*! exports provided: changeIsExcludeTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "changeIsExcludeTest", function() { return changeIsExcludeTest; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./www/js/source/reactpages/actions/types.js");

var changeIsExcludeTest = function changeIsExcludeTest(checked) {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["CHANGE_IS_EXCLUDE_TEST"],
    data: checked
  };
};

/***/ }),

/***/ "./www/js/source/reactpages/actions/loaderAction.js":
/*!**********************************************************!*\
  !*** ./www/js/source/reactpages/actions/loaderAction.js ***!
  \**********************************************************/
/*! exports provided: toggleLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleLoader", function() { return toggleLoader; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./www/js/source/reactpages/actions/types.js");

var toggleLoader = function toggleLoader(show) {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["TOGGLE_LOADER"],
    data: show
  };
};

/***/ }),

/***/ "./www/js/source/reactpages/actions/types.js":
/*!***************************************************!*\
  !*** ./www/js/source/reactpages/actions/types.js ***!
  \***************************************************/
/*! exports provided: FETCH_DATA, SET_GRID_DATA, SET_SELECTED_PRODUCT, SET_SELECTED_BASECURRENCY, SET_BASECURRENCY_LIST, SET_SELECTED_CURRENCY, TOGGLE_LOADER, CHANGE_IS_EXCLUDE_TEST, USER_GUIDE_CONTENT, SET_DATE_RANGE, GET_DATE_CONSTRAINT, CHANGE_IS_CONVERT_ALL, SET_SELECTED_STATUS, SET_SELECTED_PLATFORM, SET_SELECTED_LIVESTATUS, SET_USERNAME, SET_REQUEST_PARAM, SET_REPORT_TITLE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_DATA", function() { return FETCH_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_GRID_DATA", function() { return SET_GRID_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SELECTED_PRODUCT", function() { return SET_SELECTED_PRODUCT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SELECTED_BASECURRENCY", function() { return SET_SELECTED_BASECURRENCY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_BASECURRENCY_LIST", function() { return SET_BASECURRENCY_LIST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SELECTED_CURRENCY", function() { return SET_SELECTED_CURRENCY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOGGLE_LOADER", function() { return TOGGLE_LOADER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_IS_EXCLUDE_TEST", function() { return CHANGE_IS_EXCLUDE_TEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_GUIDE_CONTENT", function() { return USER_GUIDE_CONTENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_DATE_RANGE", function() { return SET_DATE_RANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_DATE_CONSTRAINT", function() { return GET_DATE_CONSTRAINT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_IS_CONVERT_ALL", function() { return CHANGE_IS_CONVERT_ALL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SELECTED_STATUS", function() { return SET_SELECTED_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SELECTED_PLATFORM", function() { return SET_SELECTED_PLATFORM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SELECTED_LIVESTATUS", function() { return SET_SELECTED_LIVESTATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_USERNAME", function() { return SET_USERNAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_REQUEST_PARAM", function() { return SET_REQUEST_PARAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_REPORT_TITLE", function() { return SET_REPORT_TITLE; });
var FETCH_DATA = 'FETCH_DATA';
var SET_GRID_DATA = "SET_GRID_DATA";
/* Product */

var SET_SELECTED_PRODUCT = "SET_SELECTED_PRODUCT";
/* Base Currency */

var SET_SELECTED_BASECURRENCY = "SET_SELECTED_BASECURRENCY";
var SET_BASECURRENCY_LIST = "SET_BASECURRENCY_LIST";
/* Currency */

var SET_SELECTED_CURRENCY = "SET_SELECTED_CURRENCY";
/* Loader */

var TOGGLE_LOADER = "TOGGLE_LOADER";
/* Exclude Test Data */

var CHANGE_IS_EXCLUDE_TEST = "CHANGE_IS_EXCLUDE_TEST";
/* User mini guide */

var USER_GUIDE_CONTENT = "USER_GUIDE_CONTENT;";
/* Date range */

var SET_DATE_RANGE = 'SET_DATE_RANGE';
var GET_DATE_CONSTRAINT = 'GET_DATE_CONSTRAINT';
/* Convert all figures to base currency */

var CHANGE_IS_CONVERT_ALL = "CHANGE_IS_CONVERT_ALL";
/* Status */

var SET_SELECTED_STATUS = "SET_SELECTED_STATUS";
/* Platform  */

var SET_SELECTED_PLATFORM = "SET_SELECTED_PLATFORM";
/* Live Status  */

var SET_SELECTED_LIVESTATUS = "SET_SELECTED_LIVESTATUS";
var SET_USERNAME = "SET_USERNAME";
var SET_REQUEST_PARAM = "SET_REQUEST_PARAM";
var SET_REPORT_TITLE = "SET_REPORT_TITLE";

/***/ }),

/***/ "./www/js/source/reactpages/components/Loader.jsx":
/*!********************************************************!*\
  !*** ./www/js/source/reactpages/components/Loader.jsx ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var Loader = function Loader(_ref) {
  var isLoading = _ref.isLoading;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-process default",
    style: {
      display: "".concat(isLoading ? 'block' : 'none')
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "icon-loading"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loader-inner ball-beat"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null))));
};

/* harmony default export */ __webpack_exports__["default"] = (Loader);

/***/ }),

/***/ "./www/js/source/reactpages/components/NoDataTitle.jsx":
/*!*************************************************************!*\
  !*** ./www/js/source/reactpages/components/NoDataTitle.jsx ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");



var NoDataTitle = function NoDataTitle() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "no-info-row center-align"
  }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource("NoInfo"));
};

/* harmony default export */ __webpack_exports__["default"] = (NoDataTitle);

/***/ }),

/***/ "./www/js/source/reactpages/components/Overlay.jsx":
/*!*********************************************************!*\
  !*** ./www/js/source/reactpages/components/Overlay.jsx ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Overlay; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var wrapperClasses = {
  OVERLAY: "overlay",
  OVERLAY_OPEN: "overlay-open"
};

var Overlay =
/*#__PURE__*/
function (_Component) {
  _inherits(Overlay, _Component);

  function Overlay(props) {
    var _this;

    _classCallCheck(this, Overlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Overlay).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_unRegisterEvents", function () {
      var closeOnOutsideClick = _this.props.closeOnOutsideClick;

      if (closeOnOutsideClick) {
        document.removeEventListener('click', _this._handleClickOutSide, true);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_handleClickOutSide", function (event) {
      var clickOutside = _this.containerElement && !_this.containerElement.contains(event.target);

      if (clickOutside && _this.state.isOpening) {
        _this._close();
      }
    });

    _this.containerElement = null;
    _this.refHandlers = {
      container: function container(ref) {
        _this.containerElement = ref;
      }
    };
    _this.state = {
      isOpening: _this.props.isOpening
    };
    return _this;
  }

  _createClass(Overlay, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.isOpening !== prevProps.isOpening) {
        var onOpen = this.props.onOpen;
        this.props.isOpening && onOpen && onOpen();
        this.setState({
          isOpening: this.props.isOpening
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this._registerEvents();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._unRegisterEvents();
    }
  }, {
    key: "_registerEvents",
    value: function _registerEvents() {
      var closeOnOutsideClick = this.props.closeOnOutsideClick;

      if (closeOnOutsideClick) {
        document.addEventListener('click', this._handleClickOutSide, true);
      }
    }
  }, {
    key: "_close",
    value: function _close() {
      var onClose = this.props.onClose;
      this.setState({
        isOpening: false
      }, function () {
        return onClose && onClose();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children;
      var mergedClassName = classnames__WEBPACK_IMPORTED_MODULE_3___default()(wrapperClasses.OVERLAY, _defineProperty({}, wrapperClasses.OVERLAY_OPEN, this.state.isOpening), className);
      var style = {
        display: this.state.isOpening ? "block" : "none"
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: mergedClassName,
        style: style,
        ref: this.refHandlers.container
      }, children);
    }
  }]);

  return Overlay;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(Overlay, "propTypes", {
  closeOnOutsideClick: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  isOpening: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  onOpen: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func,
  onClose: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func
});

_defineProperty(Overlay, "defaultProps", {
  closeOnOutsideClick: true,
  isOpening: false
});



/***/ }),

/***/ "./www/js/source/reactpages/components/ReportTitle.jsx":
/*!*************************************************************!*\
  !*** ./www/js/source/reactpages/components/ReportTitle.jsx ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var ReportTitle = function ReportTitle(_ref) {
  var content = _ref.content;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "report-title-container"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "report-title"
  }, content));
};

/* harmony default export */ __webpack_exports__["default"] = (ReportTitle);

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/Calendar.js":
/*!********************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/Calendar.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/parseInput.js */ "./www/js/source/reactpages/components/date-range/utils/parseInput.js");
/* harmony import */ var _DayCell_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DayCell.js */ "./www/js/source/reactpages/components/date-range/DayCell.js");
/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./styles.js */ "./www/js/source/reactpages/components/date-range/styles.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants */ "./www/js/source/reactpages/components/date-range/constants.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








var START_OF_MONTH = 0;
var END_OF_MONTH = 11;
var START_DAY_OF_MONTH = 1;
var DEFAULT_YEAR_RANGE = 5;

function checkRange(dayMoment, range) {
  return dayMoment.isBetween(range['startDate'], range['endDate']) || dayMoment.isBetween(range['endDate'], range['startDate']);
}

function checkStartEdge(dayMoment, range) {
  var startDate = range.startDate;
  return dayMoment.startOf('day').isSame(startDate.startOf('day'));
}

function checkEndEdge(dayMoment, range) {
  var endDate = range.endDate;
  return dayMoment.endOf('day').isSame(endDate.endOf('day'));
}

function isOusideMinMax(dayMoment, minDate, maxDate, format) {
  return minDate && dayMoment.isBefore(Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__["default"])(minDate, format, 'startOf')) || maxDate && dayMoment.isAfter(Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__["default"])(maxDate, format, 'endOf'));
}

var Calendar =
/*#__PURE__*/
function (_Component) {
  _inherits(Calendar, _Component);

  function Calendar(props, context) {
    var _this;

    _classCallCheck(this, Calendar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Calendar).call(this, props, context));
    var format = props.format,
        range = props.range,
        theme = props.theme,
        offset = props.offset,
        firstDayOfWeek = props.firstDayOfWeek,
        shownDate = props.shownDate;
    var date = Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__["default"])(props.date, format, 'startOf');
    var showDate = (shownDate || range && range['endDate'] || date).clone();
    var state = {
      date: date,
      shownDate: showDate,
      firstDayOfWeek: firstDayOfWeek || moment__WEBPACK_IMPORTED_MODULE_2___default.a.localeData().firstDayOfWeek()
    };
    _this.state = state;
    _this.styles = Object(_styles_js__WEBPACK_IMPORTED_MODULE_5__["default"])(theme);
    return _this;
  }

  _createClass(Calendar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var onInit = this.props.onInit;
      onInit && onInit(this.state.date);
    }
  }, {
    key: "getShownDate",
    value: function getShownDate() {
      var link = this.props.link;
      var shownDate = link || this.state.shownDate;
      return shownDate;
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(newDate) {
      var _this$props = this.props,
          link = _this$props.link,
          onChange = _this$props.onChange;
      onChange && onChange(newDate);

      if (!link) {
        this.setState({
          date: newDate
        });
      }
    }
  }, {
    key: "nextButtonClickHandler",
    value: function nextButtonClickHandler(event) {
      event.preventDefault();

      if (!this.disableNextButton) {
        this.changeMonth(this.state.shownDate.month() + 1, event);
      }
    }
  }, {
    key: "prevButtonClickHandler",
    value: function prevButtonClickHandler(event) {
      event.preventDefault();

      if (!this.disablePrevButton) {
        this.changeMonth(this.state.shownDate.month() - 1, event);
      }
    }
  }, {
    key: "changeMonth",
    value: function changeMonth(direction, event) {
      event.preventDefault();
      var selectedMonth = Number(direction);
      var year = this.state.shownDate.year();

      if (selectedMonth < START_OF_MONTH) {
        selectedMonth = END_OF_MONTH;
        year -= 1;
      }

      if (selectedMonth > END_OF_MONTH) {
        selectedMonth = START_OF_MONTH;
        year += 1;
      }

      var _this$props2 = this.props,
          link = _this$props2.link,
          linkCB = _this$props2.linkCB;
      var newDate = moment__WEBPACK_IMPORTED_MODULE_2___default()([year, selectedMonth, this.state.shownDate.date()]);

      if (!newDate.isValid()) {
        newDate = moment__WEBPACK_IMPORTED_MODULE_2___default()([year, selectedMonth, START_DAY_OF_MONTH]);
      }

      if (link && linkCB) {
        return linkCB(newDate);
      }

      this.setState({
        shownDate: newDate
      });
    }
  }, {
    key: "changeYear",
    value: function changeYear(event) {
      event.preventDefault();
      var selectedYear = Number(event.target.value);
      var newDate = moment__WEBPACK_IMPORTED_MODULE_2___default()([selectedYear, this.state.shownDate.month(), this.state.shownDate.date()]);

      if (!newDate.isValid()) {
        newDate = moment__WEBPACK_IMPORTED_MODULE_2___default()([selectedYear, this.state.shownDate.month(), START_DAY_OF_MONTH]);
      }

      this.setState({
        shownDate: newDate
      });
    }
  }, {
    key: "renderMonthList",
    value: function renderMonthList(classes) {
      var _this2 = this;

      var styles = this.styles;
      var _this$props3 = this.props,
          onlyClasses = _this$props3.onlyClasses,
          locale = _this$props3.locale;
      var monthLabels = locale.months;
      var monthOptions = [];

      for (var i = 0; i < 12; i++) {
        var isDisabled = this._isDisabledMonth(i);

        monthOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
          disabled: isDisabled,
          key: "month".concat(i),
          value: i
        }, monthLabels[i]));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        style: onlyClasses ? undefined : styles["MonthAndYearSelect"],
        className: classes.monthAndYearSelect,
        onChange: function onChange(e) {
          return _this2.changeMonth(e.target.value, e);
        },
        value: this.state.shownDate.month()
      }, monthOptions);
    }
  }, {
    key: "_isDisabledMonth",
    value: function _isDisabledMonth(currentMonth) {
      var range = this.limitedDate;
      var currentYear = this.state.shownDate.year();
      return currentMonth < range.startDate.month() && currentYear <= range.startDate.year() || currentMonth > range.endDate.month() && currentYear >= range.endDate.year();
    }
  }, {
    key: "renderYearList",
    value: function renderYearList(classes) {
      var styles = this.styles;
      var onlyClasses = this.props.onlyClasses;
      var range = this.limitedDate;
      var yearOptions = [];

      for (var i = range.startDate.year(); i <= range.endDate.year(); i++) {
        yearOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
          key: "year".concat(i),
          value: i
        }, i));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        style: onlyClasses ? undefined : styles["MonthAndYearSelect"],
        className: classes.monthAndYearSelect,
        onChange: this.changeYear.bind(this),
        value: this.state.shownDate.year()
      }, yearOptions);
    }
  }, {
    key: "renderMonthAndYear",
    value: function renderMonthAndYear(classes) {
      var shownDate = this.getShownDate();
      var year = shownDate.year();
      var styles = this.styles;
      var _this$props4 = this.props,
          minDate = _this$props4.minDate,
          maxDate = _this$props4.maxDate,
          onlyClasses = _this$props4.onlyClasses,
          showMonthArrow = _this$props4.showMonthArrow;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: onlyClasses ? undefined : styles['MonthAndYear'],
        className: classes.monthAndYearWrapper
      }, showMonthArrow ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        disabled: this.disablePrevButton,
        style: onlyClasses ? undefined : _objectSpread({}, styles['MonthButton'], {
          float: 'left'
        }),
        className: classes.prevButton,
        onClick: this.prevButtonClickHandler.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        style: onlyClasses ? undefined : _objectSpread({}, styles['MonthArrow'], styles['MonthArrowPrev'])
      })) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: classes.month
      }, this.renderMonthList(classes)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: classes.monthAndYearDivider
      }, "\xA0"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: classes.year
      }, this.renderYearList(classes))), showMonthArrow ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        disabled: this.disableNextButton,
        style: onlyClasses ? undefined : _objectSpread({}, styles['MonthButton'], {
          float: 'right'
        }),
        className: classes.nextButton,
        onClick: this.nextButtonClickHandler.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        style: onlyClasses ? undefined : _objectSpread({}, styles['MonthArrow'], styles['MonthArrowNext'])
      })) : null);
    }
  }, {
    key: "renderWeekdays",
    value: function renderWeekdays(classes) {
      var dow = this.state.firstDayOfWeek;
      var weekdays = [];
      var styles = this.styles;
      var _this$props5 = this.props,
          onlyClasses = _this$props5.onlyClasses,
          locale = _this$props5.locale;
      var weekDays = locale.weekdays;
      var dayLength = 7 + dow;

      for (var i = dow; i < dayLength; i++) {
        var weekDayIndex = i % 7;
        var day = weekDays[weekDayIndex];
        weekdays.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          style: onlyClasses ? undefined : styles['Weekday'],
          className: classes.weekDay,
          key: i + day
        }, day));
      }

      return weekdays;
    }
  }, {
    key: "renderDays",
    value: function renderDays(classes) {
      var _this3 = this;

      // TODO: Split this logic into smaller chunks
      var styles = this.styles;
      var _this$props6 = this.props,
          range = _this$props6.range,
          minDate = _this$props6.minDate,
          maxDate = _this$props6.maxDate,
          format = _this$props6.format,
          onlyClasses = _this$props6.onlyClasses,
          disableDaysBeforeToday = _this$props6.disableDaysBeforeToday,
          specialDays = _this$props6.specialDays;
      var shownDate = this.getShownDate();
      var _this$state = this.state,
          date = _this$state.date,
          firstDayOfWeek = _this$state.firstDayOfWeek;
      var dateUnix = date.unix();
      var monthNumber = shownDate.month();
      var dayCount = shownDate.daysInMonth();
      var startOfMonth = shownDate.clone().startOf('month').isoWeekday();
      var lastMonth = shownDate.clone().month(monthNumber - 1);
      var lastMonthNumber = lastMonth.month();
      var lastMonthDayCount = lastMonth.daysInMonth();
      var nextMonth = shownDate.clone().month(monthNumber + 1);
      var nextMonthNumber = nextMonth.month();
      var days = []; // Previous month's days

      var diff = Math.abs(firstDayOfWeek - (startOfMonth + 7)) % 7;

      for (var i = diff - 1; i >= 0; i--) {
        var dayMoment = lastMonth.clone().date(lastMonthDayCount - i);
        days.push({
          dayMoment: dayMoment,
          isPassive: true
        });
      } // Current month's days


      for (var _i = 1; _i <= dayCount; _i++) {
        var _dayMoment = shownDate.clone().date(_i); // set days before today to isPassive


        var _today = moment__WEBPACK_IMPORTED_MODULE_2___default()();

        if (disableDaysBeforeToday && Number(_dayMoment.diff(_today, "days")) <= -1) {
          days.push({
            dayMoment: _dayMoment,
            isPassive: true
          });
        } else {
          days.push({
            dayMoment: _dayMoment
          });
        }
      } // Next month's days


      var remainingCells = 42 - days.length; // 42cells = 7days * 6rows

      for (var _i2 = 1; _i2 <= remainingCells; _i2++) {
        var _dayMoment2 = nextMonth.clone().date(_i2);

        days.push({
          dayMoment: _dayMoment2,
          isPassive: true
        });
      }

      var today = moment__WEBPACK_IMPORTED_MODULE_2___default()().startOf('day');
      return days.map(function (data, index) {
        var dayMoment = data.dayMoment,
            isPassive = data.isPassive;
        var isSelected = !range && dayMoment.unix() === dateUnix;
        var isInRange = range && checkRange(dayMoment, range);
        var isStartEdge = range && checkStartEdge(dayMoment, range);
        var isEndEdge = range && checkEndEdge(dayMoment, range);
        var isEdge = isStartEdge || isEndEdge;
        var isToday = today.isSame(dayMoment);
        var isSunday = dayMoment.day() === 0;
        var isSpecialDay = specialDays && specialDays.some(function (specialDay) {
          return dayMoment.endOf('day').isSame(specialDay.date.endOf('day'));
        });
        var isOutsideMinMax = isOusideMinMax(dayMoment, minDate, maxDate, format);
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DayCell_js__WEBPACK_IMPORTED_MODULE_4__["default"], _extends({
          onSelect: _this3.handleSelect.bind(_this3)
        }, data, {
          theme: styles,
          isStartEdge: isStartEdge,
          isEndEdge: isEndEdge,
          isSelected: isSelected || isEdge,
          isInRange: isInRange,
          isSunday: isSunday,
          isSpecialDay: isSpecialDay,
          isToday: isToday,
          key: index,
          isPassive: isPassive || isOutsideMinMax,
          onlyClasses: onlyClasses,
          classNames: classes
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var styles = this.styles;
      var _this$props7 = this.props,
          onlyClasses = _this$props7.onlyClasses,
          classNames = _this$props7.classNames;

      var classes = _objectSpread({}, _styles_js__WEBPACK_IMPORTED_MODULE_5__["defaultClasses"], classNames);

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: onlyClasses ? undefined : _objectSpread({}, styles['Calendar'], this.props.style),
        className: classes.calendar
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classes.monthAndYear
      }, this.renderMonthAndYear(classes)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classes.weekDays
      }, this.renderWeekdays(classes)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classes.days
      }, this.renderDays(classes)));
    }
  }, {
    key: "limitedDate",
    get: function get() {
      var _this$props8 = this.props,
          minDate = _this$props8.minDate,
          maxDate = _this$props8.maxDate;
      var m = moment__WEBPACK_IMPORTED_MODULE_2___default()();
      var startDate, endDate;

      if (minDate) {
        startDate = moment__WEBPACK_IMPORTED_MODULE_2___default.a.isMoment(minDate) ? minDate : moment__WEBPACK_IMPORTED_MODULE_2___default()(minDate, _constants__WEBPACK_IMPORTED_MODULE_6__["MomentFormat"].default);
      } else {
        startDate = moment__WEBPACK_IMPORTED_MODULE_2___default()([m.year() - DEFAULT_YEAR_RANGE, START_OF_MONTH]);
      }

      if (maxDate) {
        endDate = moment__WEBPACK_IMPORTED_MODULE_2___default.a.isMoment(maxDate) ? maxDate : moment__WEBPACK_IMPORTED_MODULE_2___default()(maxDate, _constants__WEBPACK_IMPORTED_MODULE_6__["MomentFormat"].default);
      } else {
        endDate = moment__WEBPACK_IMPORTED_MODULE_2___default()([m.year(), END_OF_MONTH]).endOf("month");
      }

      return {
        startDate: startDate,
        endDate: endDate
      };
    }
  }, {
    key: "disablePrevButton",
    get: function get() {
      var range = this.limitedDate;
      var startDate = range.startDate;
      var currentDate = this.state.shownDate;
      var prevMonth = this.state.shownDate.month() - 1;

      if (prevMonth < startDate.month() && currentDate.year() <= startDate.year()) {
        return true;
      }

      return false;
    }
  }, {
    key: "disableNextButton",
    get: function get() {
      var range = this.limitedDate;
      var endDate = range.endDate;
      var currentDate = this.state.shownDate;
      var nextMonth = this.state.shownDate.month() + 1;

      if (nextMonth > endDate.month() && currentDate.year() >= endDate.year()) {
        return true;
      }

      return false;
    }
  }]);

  return Calendar;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

Calendar.defaultProps = {
  format: _constants__WEBPACK_IMPORTED_MODULE_6__["MomentFormat"].default,
  theme: {},
  showMonthArrow: true,
  disableDaysBeforeToday: false,
  onlyClasses: false,
  classNames: {},
  specialDays: []
};
Calendar.propTypes = {
  showMonthArrow: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  disableDaysBeforeToday: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  lang: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  sets: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  range: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
    startDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
    endDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
  }),
  minDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  maxDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  date: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func]),
  format: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  firstDayOfWeek: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onInit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  link: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
    startDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
    endDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
  }), prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool]),
  linkCB: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  theme: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  onlyClasses: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  specialDays: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,
  classNames: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  locale: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
};
/* harmony default export */ __webpack_exports__["default"] = (Calendar);

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/DatePicker.jsx":
/*!***********************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/DatePicker.jsx ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DatePicker; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/parseInput.js */ "./www/js/source/reactpages/components/date-range/utils/parseInput.js");
/* harmony import */ var _defaultOptions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaultOptions.js */ "./www/js/source/reactpages/components/date-range/defaultOptions.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants */ "./www/js/source/reactpages/components/date-range/constants.js");
/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles.js */ "./www/js/source/reactpages/components/date-range/styles.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _Overlay__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Overlay */ "./www/js/source/reactpages/components/Overlay.jsx");
/* harmony import */ var _Calendar_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Calendar.js */ "./www/js/source/reactpages/components/date-range/Calendar.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }












var DatePicker =
/*#__PURE__*/
function (_Component) {
  _inherits(DatePicker, _Component);

  function DatePicker(props) {
    var _this;

    _classCallCheck(this, DatePicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DatePicker).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "show", function () {
      _this.setState({
        show: true
      });
    });

    var locale = props.locale,
        date = props.date,
        format = props.format;
    _this.locale = _objectSpread({}, _defaultOptions_js__WEBPACK_IMPORTED_MODULE_4__["default"].locale, locale);
    var selectedDate = Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__["default"])(date, format, 'startOf');
    _this.state = {
      selectedDate: selectedDate,
      show: false
    };
    return _this;
  }

  _createClass(DatePicker, [{
    key: "handleSelect",
    value: function handleSelect(date) {
      var onChange = this.props.onChange;
      onChange && onChange(date);
      this.setState({
        selectedDate: date,
        show: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          format = _this$props.format,
          firstDayOfWeek = _this$props.firstDayOfWeek,
          minDate = _this$props.minDate,
          maxDate = _this$props.maxDate,
          classNames = _this$props.classNames;

      var classes = _objectSpread({}, _styles_js__WEBPACK_IMPORTED_MODULE_6__["defaultClasses"], classNames);

      var show = this.state.show;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "daterange-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "daterange-label",
        onClick: this.show
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        readOnly: true,
        className: "input-text datepicker",
        type: "text",
        autoComplete: "off",
        value: this.dateText
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "icon icon-calendar"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Overlay__WEBPACK_IMPORTED_MODULE_8__["default"], {
        isOpening: show
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classes.dateRange
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Calendar_js__WEBPACK_IMPORTED_MODULE_9__["default"], {
        shownDate: this.state.selectedDate,
        format: format,
        firstDayOfWeek: firstDayOfWeek,
        minDate: minDate,
        maxDate: maxDate,
        classNames: classNames,
        onChange: this.handleSelect.bind(this),
        locale: this.locale
      }))));
    }
  }, {
    key: "dateText",
    get: function get() {
      var selectedDate = this.state.selectedDate;

      if (selectedDate) {
        return "".concat(selectedDate.format(this.props.format));
      }

      return "";
    }
  }]);

  return DatePicker;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(DatePicker, "propTypes", {
  format: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  firstDayOfWeek: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  minDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  maxDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  classNames: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onInit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  locale: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  date: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string])
});

_defineProperty(DatePicker, "defaultProps", {
  format: _constants__WEBPACK_IMPORTED_MODULE_5__["MomentFormat"].default
});



/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/DateRange.js":
/*!*********************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/DateRange.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/parseInput.js */ "./www/js/source/reactpages/components/date-range/utils/parseInput.js");
/* harmony import */ var _Calendar_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Calendar.js */ "./www/js/source/reactpages/components/date-range/Calendar.js");
/* harmony import */ var _PredefinedRanges_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PredefinedRanges.js */ "./www/js/source/reactpages/components/date-range/PredefinedRanges.js");
/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles.js */ "./www/js/source/reactpages/components/date-range/styles.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./constants */ "./www/js/source/reactpages/components/date-range/constants.js");
/* harmony import */ var _defaultOptions_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./defaultOptions.js */ "./www/js/source/reactpages/components/date-range/defaultOptions.js");
/* harmony import */ var _Overlay__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Overlay */ "./www/js/source/reactpages/components/Overlay.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }













var DateRange =
/*#__PURE__*/
function (_Component) {
  _inherits(DateRange, _Component);

  function DateRange(props, context) {
    var _this;

    _classCallCheck(this, DateRange);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateRange).call(this, props, context));

    _defineProperty(_assertThisInitialized(_this), "show", function () {
      _this.calendarSelectionStep = 0;

      _this.setState({
        show: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleApply", function () {
      var _this$props = _this.props,
          onClickApplyButton = _this$props.onClickApplyButton,
          onChange = _this$props.onChange;
      var range = _this.state.range;
      _this.originalRange = Object.assign({}, range);
      onClickApplyButton && onClickApplyButton(range, _this.isValid);
      onChange && onChange(range, _this.isValid);

      _this.close();
    });

    _defineProperty(_assertThisInitialized(_this), "handleCancel", function () {
      _this.setRange(_this.originalRange, false);
    });

    var format = props.format,
        linkedCalendars = props.linkedCalendars,
        theme = props.theme;
    var startDate = Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__["default"])(props.startDate, format, 'startOf');
    var endDate = Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_3__["default"])(props.endDate, format, 'endOf');
    _this.styles = Object(_styles_js__WEBPACK_IMPORTED_MODULE_6__["default"])(theme);
    _this.calendarSelectionStep = 0;
    _this.locale = _objectSpread({}, _defaultOptions_js__WEBPACK_IMPORTED_MODULE_9__["default"].locale, props.locale);
    _this.ranges = _objectSpread({}, _defaultOptions_js__WEBPACK_IMPORTED_MODULE_9__["default"].ranges(props.today, props.minDate, props.maxDate, props.limitedMonthRange), props.ranges);
    _this.isValid = true;
    _this.originalRange = {
      startDate: startDate,
      endDate: endDate
    };
    _this.state = {
      range: {
        startDate: startDate,
        endDate: endDate
      },
      link: linkedCalendars && endDate,
      show: false
    };
    return _this;
  }

  _createClass(DateRange, [{
    key: "close",
    value: function close() {
      this.setState({
        show: false
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var onInit = this.props.onInit;
      onInit && onInit(this.state.range);
    }
  }, {
    key: "orderRange",
    value: function orderRange(range) {
      var startDate = range.startDate,
          endDate = range.endDate;
      var swap = startDate.isAfter(endDate);
      if (!swap) return range;
      return {
        startDate: endDate,
        endDate: startDate
      };
    }
  }, {
    key: "setRange",
    value: function setRange(dateRange, show) {
      var range = this.orderRange(dateRange);
      this.isValid = this.isValidMonthRange(range);

      if (this.isValid) {
        var newState = show === undefined ? {
          range: range
        } : {
          range: range,
          show: show
        };
        this.setState(newState);
      } else {
        var onChange = this.props.onChange;
        onChange && onChange(range, false);
      }
    }
  }, {
    key: "handlePredefinedRangesSelect",
    value: function handlePredefinedRangesSelect(range) {
      this.setRange(range, false);
      this.originalRange = Object.assign({}, range);
      var onChange = this.props.onChange;
      onChange && onChange(range, true);
    }
  }, {
    key: "handleCalendarSelect",
    value: function handleCalendarSelect(date) {
      var _this$state$range = this.state.range,
          startDate = _this$state$range.startDate,
          endDate = _this$state$range.endDate;
      var range = {
        startDate: startDate,
        endDate: endDate
      };

      switch (this.calendarSelectionStep) {
        case 0:
          range['startDate'] = date;
          range['endDate'] = date;
          this.calendarSelectionStep = 1;
          break;

        case 1:
          range['endDate'] = date;
          this.calendarSelectionStep = 0;
          break;
      }

      this.setRange(range);
    }
  }, {
    key: "isValidMonthRange",
    value: function isValidMonthRange(date) {
      var limitedMonthRange = this.props.limitedMonthRange;

      if (limitedMonthRange) {
        var startDate = date.startDate;
        var endDate = date.endDate;
        var diffMonth = 12 * (endDate.year() - startDate.year()) + endDate.month() - startDate.month() + 1;
        return diffMonth <= limitedMonthRange;
      }

      return true;
    }
  }, {
    key: "handleLinkChange",
    value: function handleLinkChange(newDate) {
      this.setState({
        link: newDate
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          showRange = _this$props2.showRange,
          format = _this$props2.format,
          linkedCalendars = _this$props2.linkedCalendars,
          calendars = _this$props2.calendars,
          firstDayOfWeek = _this$props2.firstDayOfWeek,
          minDate = _this$props2.minDate,
          maxDate = _this$props2.maxDate,
          classNames = _this$props2.classNames,
          onlyClasses = _this$props2.onlyClasses,
          specialDays = _this$props2.specialDays,
          lang = _this$props2.lang,
          disableDaysBeforeToday = _this$props2.disableDaysBeforeToday,
          showMonthArrow = _this$props2.showMonthArrow;
      var _this$state = this.state,
          range = _this$state.range,
          link = _this$state.link;
      var styles = this.styles;

      var classes = _objectSpread({}, _styles_js__WEBPACK_IMPORTED_MODULE_6__["defaultClasses"], classNames);

      var calendarsCount = Number(calendars) - 1;
      var buttonHandlers = {
        apply: this.handleApply,
        cancel: this.handleCancel
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "daterange-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "daterange-label",
        onClick: this.show
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        readOnly: true,
        name: "DateRange",
        id: "DateRange",
        className: "input-text datepicker",
        type: "text",
        autoComplete: "off",
        value: this.dateRangeText
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "icon icon-calendar"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Overlay__WEBPACK_IMPORTED_MODULE_10__["default"], {
        isOpening: this.state.show,
        onClose: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classes.dateRange,
        ref: function ref(element) {
          return _this2.dateRangeContainer = element;
        }
      }, showRange && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PredefinedRanges_js__WEBPACK_IMPORTED_MODULE_5__["default"], {
        format: format,
        ranges: this.ranges,
        range: range,
        theme: styles,
        onSelect: function onSelect(range) {
          return _this2.handlePredefinedRangesSelect(range);
        },
        onlyClasses: onlyClasses,
        classNames: classes,
        locale: this.locale,
        buttonHandlers: buttonHandlers
      }), function () {
        var _calendars = [];

        for (var i = calendarsCount; i >= 0; i--) {
          var shownDate = i == calendarsCount ? range.startDate : range.endDate;

          _calendars.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Calendar_js__WEBPACK_IMPORTED_MODULE_4__["default"], {
            showMonthArrow: showMonthArrow,
            shownDate: shownDate,
            disableDaysBeforeToday: disableDaysBeforeToday,
            lang: lang,
            key: i,
            link: linkedCalendars && link,
            linkCB: _this2.handleLinkChange.bind(_this2),
            range: range,
            format: format,
            firstDayOfWeek: firstDayOfWeek,
            theme: styles,
            minDate: minDate,
            maxDate: maxDate,
            onlyClasses: onlyClasses,
            specialDays: specialDays,
            classNames: classes,
            onChange: _this2.handleCalendarSelect.bind(_this2),
            locale: _this2.locale
          }));
        }

        return _calendars;
      }())));
    }
  }, {
    key: "dateRangeText",
    get: function get() {
      var range = this.state.range;

      if (range.startDate && range.endDate) {
        var format = this.props.format;
        return "".concat(range.startDate.format(format), " - ").concat(range.endDate.format(format));
      }

      return "";
    }
  }]);

  return DateRange;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

DateRange.defaultProps = {
  linkedCalendars: false,
  theme: {},
  format: _constants__WEBPACK_IMPORTED_MODULE_8__["MomentFormat"].default,
  calendars: 2,
  onlyClasses: true,
  classNames: {},
  specialDays: [],
  twoStepChange: false,
  showRange: true
};
DateRange.propTypes = {
  format: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  firstDayOfWeek: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  calendars: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number]),
  startDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  endDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  minDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  maxDate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  dateLimit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  ranges: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  linkedCalendars: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  twoStepChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  theme: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  onInit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onlyClasses: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  specialDays: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,
  classNames: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  onClickApplyButton: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  showRange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  limitedMonthRange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  today: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string])
};
/* harmony default export */ __webpack_exports__["default"] = (DateRange);

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/DayCell.js":
/*!*******************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/DayCell.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.js */ "./www/js/source/reactpages/components/date-range/styles.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var DayCell =
/*#__PURE__*/
function (_Component) {
  _inherits(DayCell, _Component);

  function DayCell(props, context) {
    var _this;

    _classCallCheck(this, DayCell);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DayCell).call(this, props, context));
    _this.state = {
      hover: false,
      active: false
    };
    _this.styles = _this.props.theme;
    return _this;
  }

  _createClass(DayCell, [{
    key: "handleMouseEvent",
    value: function handleMouseEvent(event) {
      event.preventDefault();
      if (this.props.isPassive) return null;
      var newState = {};

      switch (event.type) {
        case 'mouseenter':
          newState['hover'] = true;
          break;

        case 'mouseup':
        case 'mouseleave':
          newState['hover'] = false;
          newState['active'] = false;
          break;

        case 'mousedown':
          newState['active'] = true;
          break;
      }

      this.setState(newState);
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(event) {
      event.preventDefault();
      if (this.props.isPassive) return null;
      this.props.onSelect(this.props.dayMoment);
    }
  }, {
    key: "getStateStyles",
    value: function getStateStyles() {
      var _this$state = this.state,
          hover = _this$state.hover,
          active = _this$state.active;
      var _this$props = this.props,
          isSelected = _this$props.isSelected,
          isInRange = _this$props.isInRange,
          isPassive = _this$props.isPassive,
          isStartEdge = _this$props.isStartEdge,
          isEndEdge = _this$props.isEndEdge,
          dayMoment = _this$props.dayMoment,
          isToday = _this$props.isToday,
          isSunday = _this$props.isSunday,
          isSpecialDay = _this$props.isSpecialDay;
      var styles = this.styles;
      var hoverStyle = hover ? styles['DayHover'] : {};
      var activeStyle = active ? styles['DayActive'] : {};
      var passiveStyle = isPassive ? styles['DayPassive'] : {};
      var startEdgeStyle = isStartEdge ? styles['DayStartEdge'] : {};
      var endEdgeStyle = isEndEdge ? styles['DayEndEdge'] : {};
      var selectedStyle = isSelected ? styles['DaySelected'] : {};
      var inRangeStyle = isInRange ? styles['DayInRange'] : {};
      var todayStyle = isToday ? styles['DayToday'] : {};
      var sundayStyle = isSunday ? styles['DaySunday'] : {};
      var specialDayStyle = isSpecialDay ? styles['DaySpecialDay'] : {};
      return _objectSpread({}, todayStyle, sundayStyle, specialDayStyle, inRangeStyle, hoverStyle, passiveStyle, activeStyle, selectedStyle, startEdgeStyle, endEdgeStyle);
    }
  }, {
    key: "getClassNames",
    value: function getClassNames(classes) {
      var _classnames;

      var _this$props2 = this.props,
          isSelected = _this$props2.isSelected,
          isInRange = _this$props2.isInRange,
          isPassive = _this$props2.isPassive,
          isStartEdge = _this$props2.isStartEdge,
          isEndEdge = _this$props2.isEndEdge,
          isToday = _this$props2.isToday,
          isSunday = _this$props2.isSunday,
          isSpecialDay = _this$props2.isSpecialDay;
      return classnames__WEBPACK_IMPORTED_MODULE_2___default()((_classnames = {}, _defineProperty(_classnames, classes.day, true), _defineProperty(_classnames, classes.dayActive, isSelected), _defineProperty(_classnames, classes.dayPassive, isPassive), _defineProperty(_classnames, classes.dayInRange, isInRange), _defineProperty(_classnames, classes.dayStartEdge, isStartEdge), _defineProperty(_classnames, classes.dayEndEdge, isEndEdge), _defineProperty(_classnames, classes.dayToday, isToday), _defineProperty(_classnames, classes.daySunday, isSunday), _defineProperty(_classnames, classes.daySpecialDay, isSpecialDay), _classnames));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          dayMoment = _this$props3.dayMoment,
          onlyClasses = _this$props3.onlyClasses,
          classNames = _this$props3.classNames;
      var styles = this.styles;
      var stateStyle = this.getStateStyles();
      var classes = this.getClassNames(classNames);
      var dayWrapperStyles = {
        width: styles['Day'].width,
        height: styles['Day'].height,
        display: styles['Day'].display
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        style: onlyClasses ? undefined : dayWrapperStyles,
        onClick: this.handleSelect.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        onMouseEnter: this.handleMouseEvent.bind(this),
        onMouseLeave: this.handleMouseEvent.bind(this),
        onMouseDown: this.handleMouseEvent.bind(this),
        onMouseUp: this.handleMouseEvent.bind(this),
        className: classes,
        style: onlyClasses ? undefined : _objectSpread({}, styles['Day'], stateStyle)
      }, dayMoment.date()));
    }
  }]);

  return DayCell;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

DayCell.defaultProps = {
  theme: {
    'Day': {}
  },
  onlyClasses: false
};
DayCell.propTypes = {
  dayMoment: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  onSelect: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  isSelected: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  isInRange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  isPassive: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  theme: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
    Day: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired
  }).isRequired,
  onlyClasses: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  isSpecialDay: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  classNames: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
};
/* harmony default export */ __webpack_exports__["default"] = (DayCell);

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/PredefinedRanges.js":
/*!****************************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/PredefinedRanges.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_parseInput_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/parseInput.js */ "./www/js/source/reactpages/components/date-range/utils/parseInput.js");
/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./styles.js */ "./www/js/source/reactpages/components/date-range/styles.js");
/* harmony import */ var _defaultOptions_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./defaultOptions.js */ "./www/js/source/reactpages/components/date-range/defaultOptions.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }









var PredefinedRanges =
/*#__PURE__*/
function (_Component) {
  _inherits(PredefinedRanges, _Component);

  function PredefinedRanges(props, context) {
    var _this;

    _classCallCheck(this, PredefinedRanges);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PredefinedRanges).call(this, props, context));
    _this.styles = _this.props.theme;
    _this.selectedItem = _this._getSelectedRange();
    return _this;
  }

  _createClass(PredefinedRanges, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.range !== prevProps.range) {
        this.selectedItem = this._getSelectedRange();
      }
    }
  }, {
    key: "_getSelectedRange",
    value: function _getSelectedRange() {
      var _this$props = this.props,
          ranges = _this$props.ranges,
          range = _this$props.range;
      return Object.keys(ranges).find(function (name) {
        var currentRange = ranges[name];
        return range.startDate.isSame(currentRange.startDate, "day") && range.endDate.isSame(currentRange.endDate, "day");
      });
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(name, event) {
      event.preventDefault();
      this.selectedItem = name;
      var range = this.props.ranges[name];
      this.props.onSelect({
        startDate: Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_4__["default"])(range['startDate'], null, 'startOf'),
        endDate: Object(_utils_parseInput_js__WEBPACK_IMPORTED_MODULE_4__["default"])(range['endDate'], null, 'endOf')
      });
    }
  }, {
    key: "clickButton",
    value: function clickButton(event, action) {
      event.preventDefault();
      this.props.buttonHandlers[action]();
    }
  }, {
    key: "renderRangeList",
    value: function renderRangeList(classes) {
      var _this2 = this;

      var _this$props2 = this.props,
          ranges = _this$props2.ranges,
          range = _this$props2.range,
          onlyClasses = _this$props2.onlyClasses;
      var styles = this.styles;
      var gotActiveRange = false;
      return Object.keys(ranges).map(function (name) {
        var _classnames;

        var active = _this2.selectedItem === name;
        gotActiveRange = !gotActiveRange && active;

        var style = _objectSpread({}, styles['PredefinedRangesItem'], gotActiveRange ? styles['PredefinedRangesItemActive'] : {});

        var predefinedRangeClass = classnames__WEBPACK_IMPORTED_MODULE_3___default()((_classnames = {}, _defineProperty(_classnames, classes.predefinedRangesItem, true), _defineProperty(_classnames, classes.predefinedRangesItemActive, gotActiveRange), _classnames));
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          key: 'range-' + name,
          className: predefinedRangeClass,
          style: onlyClasses ? undefined : style,
          onClick: function onClick(e) {
            return _this2.handleSelect(name, e);
          }
        }, name);
      });
    }
  }, {
    key: "renderRangeButtons",
    value: function renderRangeButtons(classes) {
      var _this3 = this;

      var _this$props3 = this.props,
          style = _this$props3.style,
          onlyClasses = _this$props3.onlyClasses,
          locale = _this$props3.locale;

      var locales = _objectSpread({}, _defaultOptions_js__WEBPACK_IMPORTED_MODULE_6__["default"].locale, locale);

      var styles = this.styles;
      var action = {
        apply: "apply",
        cancel: "cancel"
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: _styles_js__WEBPACK_IMPORTED_MODULE_5__["defaultClasses"].rangeButtonGroup
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: classes.applyButton,
        style: onlyClasses ? undefined : _objectSpread({}, styles['RangeApplyButton'], style),
        type: "button",
        onClick: function onClick(e) {
          return _this3.clickButton(e, action.apply);
        }
      }, locales.applyLabel), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: classes.cancelButton,
        style: onlyClasses ? undefined : _objectSpread({}, styles['RangeCancelButton'], style),
        onClick: function onClick(e) {
          return _this3.clickButton(e, action.cancel);
        },
        type: "button"
      }, locales.cancelLabel));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          style = _this$props4.style,
          onlyClasses = _this$props4.onlyClasses,
          classNames = _this$props4.classNames;
      var styles = this.styles;

      var classes = _objectSpread({}, _styles_js__WEBPACK_IMPORTED_MODULE_5__["defaultClasses"], classNames);

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: onlyClasses ? undefined : _objectSpread({}, styles['PredefinedRanges'], style),
        className: classes.predefinedRanges
      }, this.renderRangeList(classes), this.renderRangeButtons(classes));
    }
  }]);

  return PredefinedRanges;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

PredefinedRanges.defaultProps = {
  onlyClasses: false,
  classNames: {}
};
PredefinedRanges.propTypes = {
  ranges: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  onlyClasses: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  classNames: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
};
/* harmony default export */ __webpack_exports__["default"] = (PredefinedRanges);

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/constants.js":
/*!*********************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/constants.js ***!
  \*********************************************************************/
/*! exports provided: MomentFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MomentFormat", function() { return MomentFormat; });
var MomentFormat = {
  default: "MM/DD/YYYY",
  monthSelect: "MMM"
};

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/defaultOptions.js":
/*!**************************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/defaultOptions.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var _utils_locale__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/locale */ "./www/js/source/reactpages/components/date-range/utils/locale.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./www/js/source/reactpages/components/date-range/constants.js");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var addRange = function addRange(rangeObj, name, start, end) {
  rangeObj[_lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource(name)] = {
    startDate: start,
    endDate: end
  };
};

var addOneDay = function addOneDay(rangeObj, name, day, min, max) {
  if (day >= min && day <= max) {
    addRange(rangeObj, name, day, day);
  }
};

var addDistanceDays = function addDistanceDays(rangeObj, name, start, end, min, max) {
  if (!(max < start || end < min)) {
    addRange(rangeObj, name, start < min ? min : start, end > max ? max : end);
  }
};

/* harmony default export */ __webpack_exports__["default"] = ({
  ranges: function ranges(todayDate, minDate, maxDate, limitMonths) {
    var today = !todayDate ? moment__WEBPACK_IMPORTED_MODULE_0___default()() : !moment__WEBPACK_IMPORTED_MODULE_0___default.a.isMoment(todayDate) ? moment__WEBPACK_IMPORTED_MODULE_0___default()(todayDate, _constants__WEBPACK_IMPORTED_MODULE_3__["MomentFormat"].default) : todayDate;
    var max = !maxDate ? today : !moment__WEBPACK_IMPORTED_MODULE_0___default.a.isMoment(maxDate) ? moment__WEBPACK_IMPORTED_MODULE_0___default()(maxDate, _constants__WEBPACK_IMPORTED_MODULE_3__["MomentFormat"].default) : maxDate;
    var min = !minDate ? today : !moment__WEBPACK_IMPORTED_MODULE_0___default.a.isMoment(minDate) ? moment__WEBPACK_IMPORTED_MODULE_0___default()(minDate, _constants__WEBPACK_IMPORTED_MODULE_3__["MomentFormat"].default) : minDate;
    var range = {};

    if (today < min) {
      return range;
    }

    addOneDay(range, "Today", today, min, max);
    var yesterday = today.clone().add(-1, 'days');
    addOneDay(range, "Yesterday", yesterday, min, max);
    var startCurrentWeek = today.clone().startOf('week');
    var endCurrentWeek = today;
    addDistanceDays(range, "Currentweek", startCurrentWeek, endCurrentWeek, min, max);
    var startLastWeek = today.clone().subtract(1, 'week').startOf('week');
    var endLastWeek = startLastWeek.clone().add(6, 'days');
    addDistanceDays(range, "Lastweek", startLastWeek, endLastWeek, min, max);
    var startCurrentmonth = today.clone().startOf('month');
    var endCurrentmonth = today;
    addDistanceDays(range, "Currentmonth", startCurrentmonth, endCurrentmonth, min, max);
    var startLastmonth = today.clone().subtract(1, 'month').startOf('month');
    var endLastmonth = startLastmonth.clone().endOf('month');
    addDistanceDays(range, "Lastmonth", startLastmonth, endLastmonth, min, max);

    if (limitMonths && limitMonths > 1) {
      var startSincelastmonth = today.clone().subtract(1, 'month').startOf('month');
      var endSincelastmonth = today;
      addDistanceDays(range, "Sincelastmonth", startSincelastmonth, endSincelastmonth, min, max);
    }

    return range;
  },
  locale: _objectSpread({
    applyLabel: _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource("OK"),
    cancelLabel: _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource("Cancel")
  }, _utils_locale__WEBPACK_IMPORTED_MODULE_2__["default"])
});

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/index.js":
/*!*****************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/index.js ***!
  \*****************************************************************/
/*! exports provided: DateRange, Calendar, DatePicker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DateRange_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DateRange.js */ "./www/js/source/reactpages/components/date-range/DateRange.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DateRange", function() { return _DateRange_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _Calendar_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Calendar.js */ "./www/js/source/reactpages/components/date-range/Calendar.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Calendar", function() { return _Calendar_js__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _DatePicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DatePicker */ "./www/js/source/reactpages/components/date-range/DatePicker.jsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DatePicker", function() { return _DatePicker__WEBPACK_IMPORTED_MODULE_2__["default"]; });






/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/styles.js":
/*!******************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/styles.js ***!
  \******************************************************************/
/*! exports provided: defaultClasses, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultClasses", function() { return defaultClasses; });
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultClasses = {
  show: 'rdr-Show',
  hide: 'rdr-Hide',
  calendar: 'rdr-Calendar',
  dateRange: 'rdr-DateRange',
  predefinedRanges: 'rdr-PredefinedRanges',
  predefinedRangesItem: 'rdr-PredefinedRangesItem',
  predefinedRangesItemActive: 'rdr-PredefinedRangesItemActive',
  monthAndYear: 'rdr-MonthAndYear',
  monthAndYearSelect: 'rdr-MonthAndYearSelect',
  weekDays: 'rdr-WeekDays',
  weekDay: 'rdr-WeekDay',
  days: 'rdr-Days',
  day: 'rdr-Day',
  dayActive: 'is-selected',
  dayPassive: 'is-passive',
  dayInRange: 'is-inRange',
  monthAndYearWrapper: 'rdr-MonthAndYear-innerWrapper',
  prevButton: 'rdr-MonthAndYear-button prev',
  nextButton: 'rdr-MonthAndYear-button next',
  month: 'rdr-MonthAndYear-month',
  monthAndYearDivider: 'rdr-MonthAndYear-divider',
  year: 'rdr-MonthAndYear-year',
  daySunday: 'rdr-Sunday',
  daySpecialDay: 'rdr-SpecialDay',
  rangeButtonGroup: 'range-button-group',
  applyButton: 'rdr-Button rdr-ApplyButton',
  cancelButton: 'rdr-Button rdr-CancelButton'
};
var defaultTheme = {
  DateRange: {
    display: 'none',
    boxSizing: 'border-box',
    background: '#ffffff',
    borderRadius: '2px',
    position: "absolute",
    width: 735,
    zIndex: 1,
    top: 60
  },
  Calendar: {
    width: 280,
    padding: 10,
    background: '#ffffff',
    borderRadius: '2px',
    display: 'inline-block',
    boxSizing: 'border-box',
    letterSpacing: 0,
    color: '#000000'
  },
  Day: {
    boxSizing: 'border-box',
    display: 'inline-block',
    letterSpacing: 'initial',
    textAlign: 'center',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'transform .1s ease'
  },
  DayPassive: {
    opacity: 0.4,
    cursor: 'normal'
  },
  DayHover: {
    background: 'rgba(78, 184, 94, 0.4)'
  },
  DayToday: {},
  DaySunday: {},
  DaySpecialDay: {},
  DayActive: {
    background: '#95a5a6',
    color: '#ffffff',
    transform: 'scale(0.9)'
  },
  DaySelected: {
    background: '#4eb85e',
    color: '#ffffff'
  },
  DayStartEdge: {},
  DayEndEdge: {},
  DayInRange: {
    background: 'rgba(78, 184, 94, 0.2)',
    color: '#95a5a6'
  },
  Weekday: {
    boxSizing: 'border-box',
    display: 'inline-block',
    letterSpacing: 'initial',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1
  },
  MonthAndYear: {
    textAlign: 'center',
    boxSizing: 'border-box',
    fontSize: 12,
    padding: '5px 0',
    height: 40,
    lineHeight: '18px'
  },
  MonthButton: {
    display: 'block',
    boxSizing: 'border-box',
    height: 25,
    width: 25,
    padding: 0,
    margin: '0 10px',
    border: 'none',
    boxShadow: 'none',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer'
  },
  MonthArrow: {
    display: 'block',
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
    border: '5px solid transparent',
    textAlign: 'center'
  },
  MonthArrowPrev: {
    borderRightWidth: '7px',
    borderRightColor: '#34495e',
    marginLeft: 3
  },
  MonthArrowNext: {
    borderLeftWidth: '7px',
    borderLeftColor: '#34495e',
    marginLeft: 10
  },
  MonthAndYearSelect: {
    height: 25,
    width: 65
  },
  PredefinedRanges: {
    width: 160,
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: 10,
    marginTop: 10
  },
  PredefinedRangesItem: {
    display: 'block',
    fontSize: 12,
    color: '#2c3e50',
    padding: '10px 14px',
    borderRadius: '4px',
    textDecoration: 'none',
    marginBottom: 3
  },
  PredefinedRangesItemActive: {
    background: '#4c6375',
    color: '#fff'
  },
  RangeButton: {
    border: 'none',
    borderRadius: '2px',
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    height: 25,
    lineHeight: '25px',
    textAlign: 'center',
    letterSpacing: '0.5px',
    display: 'inline-block',
    outline: 0,
    verticalAlign: 'middle',
    width: '48%',
    color: '#fff'
  },
  RangeApplyButton: {
    marginRight: 'calc(4%)',
    backgroundColor: '#f05b1f'
  },
  RangeCancelButton: {
    backgroundColor: '#757985'
  }
};
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var customTheme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var calendarWidth = defaultTheme.Calendar.width;
  var calendarPadding = defaultTheme.Calendar.padding;
  var cellMargin = defaultTheme.Day.margin || 0;

  if (customTheme.Calendar && customTheme.Calendar.hasOwnProperty('width')) {
    calendarWidth = customTheme.Calendar.width;
  }

  if (customTheme.Calendar && customTheme.Calendar.hasOwnProperty('padding')) {
    calendarPadding = customTheme.Calendar.padding;
  }

  if (customTheme.Day && customTheme.Day.hasOwnProperty('margin')) {
    cellMargin = customTheme.Day.margin;
  }

  var cellSize = (parseInt(calendarWidth, 10) - parseInt(calendarPadding, 10) * 2) / 7 - parseInt(cellMargin, 10) * 2;
  return {
    DateRange: _objectSpread({}, defaultTheme.DateRange, customTheme.DateRange),
    Calendar: _objectSpread({}, defaultTheme.Calendar, customTheme.Calendar),
    Day: _objectSpread({
      width: cellSize,
      height: cellSize,
      lineHeight: cellSize + 'px'
    }, defaultTheme.Day, customTheme.Day),
    DayPassive: _objectSpread({}, defaultTheme.DayPassive, customTheme.DayPassive),
    DayHover: _objectSpread({}, defaultTheme.DayHover, customTheme.DayHover),
    DayToday: _objectSpread({}, defaultTheme.DayToday, customTheme.DayToday),
    DaySunday: _objectSpread({}, defaultTheme.DaySunday, customTheme.DaySunday),
    DaySpecialDay: _objectSpread({}, defaultTheme.DaySpecialDay, customTheme.DaySpecialDay),
    DayActive: _objectSpread({}, defaultTheme.DayActive, customTheme.DayActive),
    DaySelected: _objectSpread({}, defaultTheme.DaySelected, customTheme.DaySelected),
    DayStartEdge: _objectSpread({}, defaultTheme.DayStartEdge, customTheme.DayStartEdge),
    DayEndEdge: _objectSpread({}, defaultTheme.DayEndEdge, customTheme.DayEndEdge),
    DayInRange: _objectSpread({}, defaultTheme.DayInRange, customTheme.DayInRange),
    Weekday: _objectSpread({
      width: cellSize,
      height: cellSize / 2,
      lineHeight: cellSize / 2 + 'px'
    }, defaultTheme.Weekday, customTheme.Weekday),
    MonthAndYear: _objectSpread({}, defaultTheme.MonthAndYear, customTheme.MonthAndYear),
    MonthAndYearSelect: _objectSpread({}, defaultTheme.MonthAndYearSelect, customTheme.MonthAndYearSelect),
    MonthButton: _objectSpread({}, defaultTheme.MonthButton, customTheme.MonthButton),
    MonthArrow: _objectSpread({}, defaultTheme.MonthArrow, customTheme.MonthArrow),
    MonthArrowPrev: _objectSpread({}, defaultTheme.MonthArrowPrev, customTheme.MonthArrowPrev),
    MonthArrowNext: _objectSpread({}, defaultTheme.MonthArrowNext, customTheme.MonthArrowNext),
    PredefinedRanges: _objectSpread({}, defaultTheme.PredefinedRanges, customTheme.PredefinedRanges),
    PredefinedRangesItem: _objectSpread({}, defaultTheme.PredefinedRangesItem, customTheme.PredefinedRangesItem),
    PredefinedRangesItemActive: _objectSpread({}, defaultTheme.PredefinedRangesItemActive, customTheme.PredefinedRangesItemActive),
    RangeApplyButton: _objectSpread({}, defaultTheme.RangeButton, defaultTheme.RangeApplyButton, customTheme.RangeApplyButton),
    RangeCancelButton: _objectSpread({}, defaultTheme.RangeButton, defaultTheme.RangeCancelButton, customTheme.RangeCancelButton)
  };
});

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/utils/locale.js":
/*!************************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/utils/locale.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");


/* harmony default export */ __webpack_exports__["default"] = ({
  months: [_lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Jan'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Feb'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Mar'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Apr'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('May'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Jun'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Jul'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Aug'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Sep'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Oct'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Nov'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Dec')],
  weekdays: [_lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Su'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Mo'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Tu'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('We'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Th'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Fr'), _lib_langHelper__WEBPACK_IMPORTED_MODULE_1__["default"].getSingleResource('Sa')]
});

/***/ }),

/***/ "./www/js/source/reactpages/components/date-range/utils/parseInput.js":
/*!****************************************************************************!*\
  !*** ./www/js/source/reactpages/components/date-range/utils/parseInput.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return parseInput; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);

function parseInput(input, format, timeOfDay) {
  var output = null;

  if (typeof input === 'undefined' || typeof input === 'null' || !input || input === '') {
    output = moment__WEBPACK_IMPORTED_MODULE_0___default()()[timeOfDay]('day');
  } else if (typeof input === 'string') {
    output = moment__WEBPACK_IMPORTED_MODULE_0___default()(input, format)[timeOfDay]('day');
  } else if (typeof input === 'function') {
    output = parseInput(input(moment__WEBPACK_IMPORTED_MODULE_0___default()()[timeOfDay]('day')), format, timeOfDay);
  } else if (input._isAMomentObject) {
    output = input[timeOfDay]('day').clone();
  }

  return output;
}

/***/ }),

/***/ "./www/js/source/reactpages/components/popup/Popup.jsx":
/*!*************************************************************!*\
  !*** ./www/js/source/reactpages/components/popup/Popup.jsx ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./www/js/source/reactpages/components/popup/constants.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);




var Popup = function Popup(props) {
  var title = props.title,
      isShow = props.isShow,
      width = props.width,
      height = props.height,
      isHtml = props.isHtml,
      children = props.children,
      iframeUrl = props.iframeUrl;
  var content;

  if (iframeUrl) {
    content = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("iframe", {
      frameBorder: "0",
      src: iframeUrl,
      width: "100%",
      height: "100%"
    });
  } else {
    content = isHtml ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "popup-content",
      dangerouslySetInnerHTML: {
        __html: children
      }
    }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "popup-content"
    }, children);
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "popup-container ".concat(isShow ? 'show' : 'hide')
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "popup-block-body"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "flat-popup",
    style: {
      height: height,
      width: width
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "popup-title"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "txt-title"
  }, title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    className: "popup-close",
    href: "javascript:;",
    onClick: function onClick() {
      props.onClose && props.onClose();
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "icon-close"
  }))), content));
};

Popup.propTypes = {
  width: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number, prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string]),
  height: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number, prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string]),
  title: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string,
  isShow: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  onClose: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func,
  isHtml: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  iframeUrl: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string
};
Popup.defaultProps = {
  width: _constants__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_WIDTH"],
  height: _constants__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_HEIGHT"],
  isShow: false,
  isHtml: false,
  iframeUrl: null
};
/* harmony default export */ __webpack_exports__["default"] = (Popup);

/***/ }),

/***/ "./www/js/source/reactpages/components/popup/constants.js":
/*!****************************************************************!*\
  !*** ./www/js/source/reactpages/components/popup/constants.js ***!
  \****************************************************************/
/*! exports provided: DEFAULT_WIDTH, DEFAULT_HEIGHT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_WIDTH", function() { return DEFAULT_WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_HEIGHT", function() { return DEFAULT_HEIGHT; });
var DEFAULT_WIDTH = '55%';
var DEFAULT_HEIGHT = '55%';

/***/ }),

/***/ "./www/js/source/reactpages/components/popup/index.jsx":
/*!*************************************************************!*\
  !*** ./www/js/source/reactpages/components/popup/index.jsx ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Popup */ "./www/js/source/reactpages/components/popup/Popup.jsx");

/* harmony default export */ __webpack_exports__["default"] = (_Popup__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./www/js/source/reactpages/constants/config.js":
/*!******************************************************!*\
  !*** ./www/js/source/reactpages/constants/config.js ***!
  \******************************************************/
/*! exports provided: debuggingConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debuggingConfig", function() { return debuggingConfig; });
var debuggingConfig = {
  name: "__lrfConfig__",
  env: "local"
};

/***/ }),

/***/ "./www/js/source/reactpages/constants/currency.js":
/*!********************************************************!*\
  !*** ./www/js/source/reactpages/constants/currency.js ***!
  \********************************************************/
/*! exports provided: BaseCurrency */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseCurrency", function() { return BaseCurrency; });
var BaseCurrency = [{
  value: -1,
  text: "EUR"
}, {
  value: -2,
  text: "USD"
}, {
  value: -3,
  text: "GBP"
}];

/***/ }),

/***/ "./www/js/source/reactpages/constants/excelStyle.js":
/*!**********************************************************!*\
  !*** ./www/js/source/reactpages/constants/excelStyle.js ***!
  \**********************************************************/
/*! exports provided: titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "titleCellStyle", function() { return titleCellStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "headerCellStyle", function() { return headerCellStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bodyCellStyle", function() { return bodyCellStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "totalCellStyle", function() { return totalCellStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "grandTotalCellStyle", function() { return grandTotalCellStyle; });
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var titleCellStyle = {
  font: {
    color: {
      rgb: "FFFFFF"
    }
  },
  fill: {
    patternType: "solid",
    fgColor: {
      rgb: "4C6375"
    }
  }
};
var headerCellStyle = {
  font: {
    bold: true,
    color: {
      rgb: "2C2C2C"
    },
    sz: "12"
  },
  alignment: {
    horizontal: "center",
    vertical: "center"
  },
  fill: {
    patternType: "solid",
    fgColor: {
      rgb: "9EB4C3"
    }
  },
  border: {
    left: {
      style: "thin",
      color: {
        rgb: "D6D6D6"
      }
    },
    bottom: {
      style: "thin",
      color: {
        rgb: "D6D6D6"
      }
    }
  }
};
var bodyTextStyle = {
  alignment: {
    vertical: "center"
  }
};
var bodyDecimalStyle = {
  numFmt: "#,##0.00"
};
var bodyCellStyle = {
  rowspan: bodyTextStyle,
  center: {
    alignment: _objectSpread({}, bodyTextStyle.alignment, {
      horizontal: "center"
    })
  },
  left: {
    alignment: _objectSpread({}, bodyTextStyle.alignment, {
      horizontal: "left"
    })
  },
  number: {
    numFmt: "#,##0"
  },
  decimal: bodyDecimalStyle,
  negativeDecimal: _objectSpread({}, bodyDecimalStyle, {
    font: {
      color: {
        rgb: "FF0000"
      }
    }
  }),
  percent: {
    numFmt: '#,##0.00%'
  }
};
var totalTextStyle = {
  font: {
    bold: true
  }
};

var totalDecimalStyle = _objectSpread({}, totalTextStyle, {
  numFmt: "#,##0.00"
});

var totalCellStyle = {
  default: totalTextStyle,
  rowspan: _objectSpread({}, totalTextStyle, {
    alignment: {
      horizontal: "center",
      vertical: "center"
    }
  }),
  center: _objectSpread({}, totalTextStyle, {
    alignment: {
      vertical: "center",
      horizontal: "center"
    }
  }),
  number: _objectSpread({}, totalTextStyle, {
    numFmt: "#,##0"
  }),
  decimal: totalDecimalStyle,
  negativeDecimal: _objectSpread({}, totalDecimalStyle, {
    font: {
      bold: true,
      color: {
        rgb: "FF0000"
      }
    }
  })
};
var grandTotalTextStyle = {
  font: {
    bold: true
  },
  fill: {
    patternType: "solid",
    fgColor: {
      rgb: "B8C3C9"
    }
  },
  border: {
    left: {
      style: "thin",
      color: {
        rgb: "D6D6D6"
      }
    }
  }
};

var decimalGrandTotalStyle = _objectSpread({}, grandTotalTextStyle, {
  numFmt: "#,##0.00"
});

var grandTotalCellStyle = {
  default: grandTotalTextStyle,
  rowspan: _objectSpread({}, grandTotalTextStyle, {
    alignment: {
      horizontal: "center",
      vertical: "center"
    }
  }),
  center: _objectSpread({}, grandTotalTextStyle, {
    alignment: {
      horizontal: "center"
    }
  }),
  number: _objectSpread({}, grandTotalTextStyle, {
    numFmt: "#,##0"
  }),
  decimal: decimalGrandTotalStyle,
  negativeDecimal: _objectSpread({}, decimalGrandTotalStyle, {
    font: {
      bold: true,
      color: {
        rgb: "FF0000"
      }
    }
  }),
  percent: _objectSpread({}, grandTotalTextStyle, {
    numFmt: "#,##0.00%"
  })
};

/***/ }),

/***/ "./www/js/source/reactpages/constants/licensee.js":
/*!********************************************************!*\
  !*** ./www/js/source/reactpages/constants/licensee.js ***!
  \********************************************************/
/*! exports provided: Licensee */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Licensee", function() { return Licensee; });
var Licensee = {
  ONE_TWO_BET: 1
};

/***/ }),

/***/ "./www/js/source/reactpages/constants/report.js":
/*!******************************************************!*\
  !*** ./www/js/source/reactpages/constants/report.js ***!
  \******************************************************/
/*! exports provided: ReportLevel, ReportBy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportLevel", function() { return ReportLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportBy", function() { return ReportBy; });
var ReportLevel = {
  MAIN: 0,
  LICENSEE: 1,
  CUSTOMER: 2
};
var ReportBy = {
  DAILY: 1,
  MONTHLY: 2
};

/***/ }),

/***/ "./www/js/source/reactpages/layouts/AppLayout.jsx":
/*!********************************************************!*\
  !*** ./www/js/source/reactpages/layouts/AppLayout.jsx ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AppLayout; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var AppLayout =
/*#__PURE__*/
function (_Component) {
  _inherits(AppLayout, _Component);

  function AppLayout(props) {
    _classCallCheck(this, AppLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppLayout).call(this, props));
  }

  _createClass(AppLayout, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "container",
        className: "container-fluid"
      }, this.props.children);
    }
  }]);

  return AppLayout;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./www/js/source/reactpages/layouts/BetListPopupLayout.jsx":
/*!*****************************************************************!*\
  !*** ./www/js/source/reactpages/layouts/BetListPopupLayout.jsx ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BetListPopupLayout; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var BetListPopupLayout =
/*#__PURE__*/
function (_Component) {
  _inherits(BetListPopupLayout, _Component);

  function BetListPopupLayout(props) {
    _classCallCheck(this, BetListPopupLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(BetListPopupLayout).call(this, props));
  }

  _createClass(BetListPopupLayout, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          children = _this$props.children;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "popup-content-default betlist-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "caption"
      }, title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "betlist-content"
      }, children));
    }
  }]);

  return BetListPopupLayout;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(BetListPopupLayout, "propTypes", {
  title: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.any
});



/***/ }),

/***/ "./www/js/source/reactpages/lib/AppData.js":
/*!*************************************************!*\
  !*** ./www/js/source/reactpages/lib/AppData.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (window._AppData || {});

/***/ }),

/***/ "./www/js/source/reactpages/lib/createReducer.js":
/*!*******************************************************!*\
  !*** ./www/js/source/reactpages/lib/createReducer.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createReducer; });
function createReducer(initialState, handlers) {
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

/***/ }),

/***/ "./www/js/source/reactpages/lib/excel.js":
/*!***********************************************!*\
  !*** ./www/js/source/reactpages/lib/excel.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Excel; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EXCEL_TYPE = "xlsx";
var MapExcelType = {
  "number": "n",
  "string": "s",
  "boolean": "b",
  "object": "d"
};
var _XLSX = null;

var Excel =
/*#__PURE__*/
function () {
  function Excel() {
    _classCallCheck(this, Excel);
  }

  _createClass(Excel, null, [{
    key: "process",
    value: function process(callback) {
      __webpack_require__.e(/*! import() | xlsx-style-sparta */ "xlsx-style-sparta").then(__webpack_require__.t.bind(null, /*! xlsx-style-sparta */ "./node_modules/xlsx-style-sparta/xlsx.js", 7)).then(function (XLSX) {
        _XLSX = XLSX;
        callback && callback();
      });
    }
  }, {
    key: "export",
    value: function _export(worksheet, fileName) {
      var option = {
        bookType: EXCEL_TYPE,
        bookSST: false,
        type: 'binary'
      };
      var workbook = {
        SheetNames: [fileName],
        Sheets: {},
        Props: {}
      };
      workbook.Sheets[fileName] = worksheet;

      var workbookOutput = _XLSX.write(workbook, option);

      this.download(workbookOutput, fileName);
    }
  }, {
    key: "getCellType",
    value: function getCellType(value) {
      return MapExcelType[_typeof(value)];
    }
  }, {
    key: "getCellAddress",
    value: function getCellAddress(cellObject) {
      return _XLSX.utils.encode_cell(cellObject);
    }
  }, {
    key: "download",
    value: function download(workbookOut, fileName) {
      var blob = new Blob([this.sheetToArrayBuffer(workbookOut)], {
        type: "application/octet-stream"
      });
      this.downloadFromBolb(blob, fileName);
    }
  }, {
    key: "downloadFromBolb",
    value: function downloadFromBolb(blob, fileName) {
      var fileNameDownload = "".concat(fileName, ".").concat(EXCEL_TYPE); // IE 10+

      if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, fileNameDownload);
      } else {
        var element = window.document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = fileNameDownload;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }
  }, {
    key: "sheetToArrayBuffer",
    value: function sheetToArrayBuffer(s) {
      var buffer = new ArrayBuffer(s.length);
      var view = new Uint8Array(buffer);

      for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }

      return buffer;
    }
  }]);

  return Excel;
}();



/***/ }),

/***/ "./www/js/source/reactpages/lib/langHelper.js":
/*!****************************************************!*\
  !*** ./www/js/source/reactpages/lib/langHelper.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LangHelper; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEFAULT_RESOURCE_NAME = "_language_en_US";
var langCode = window.PageLanguage || "en-US";
var resourceName = "_language_".concat(langCode.replace("-", "_"));

var LangHelper =
/*#__PURE__*/
function () {
  function LangHelper() {
    _classCallCheck(this, LangHelper);
  }

  _createClass(LangHelper, null, [{
    key: "getSingleResource",
    value: function getSingleResource(key) {
      var langHandler = window[resourceName];
      return langHandler && langHandler[key] || window[DEFAULT_RESOURCE_NAME] && window[DEFAULT_RESOURCE_NAME][key] || key;
    }
  }, {
    key: "getResources",
    value: function getResources(keys) {
      var langHandler = window[resourceName];
      return keys.map(function (key) {
        return langHandler && langHandler[key] || window[DEFAULT_RESOURCE_NAME] && window[DEFAULT_RESOURCE_NAME][key] || key;
      });
    }
  }, {
    key: "currentLanguage",
    get: function get() {
      return langCode;
    }
  }]);

  return LangHelper;
}();



/***/ }),

/***/ "./www/js/source/reactpages/lib/logger.js":
/*!************************************************!*\
  !*** ./www/js/source/reactpages/lib/logger.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Logger; });
/* harmony import */ var redux_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux-logger */ "./node_modules/redux-logger/dist/redux-logger.js");
/* harmony import */ var redux_logger__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux_logger__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/config */ "./www/js/source/reactpages/constants/config.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var isDev = "development" === "development";
var configName = _constants_config__WEBPACK_IMPORTED_MODULE_1__["debuggingConfig"].name; // middleware that logs actions

var loggerMiddleware = Object(redux_logger__WEBPACK_IMPORTED_MODULE_0__["createLogger"])({
  predicate: function predicate(getState, action) {
    return isDev || window[configName] && window[configName].env === _constants_config__WEBPACK_IMPORTED_MODULE_1__["debuggingConfig"].env && (!window[configName].actionFilter || window[configName].actionFilter === action.type);
  }
});

var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, null, [{
    key: "getLoggerMiddleware",
    value: function getLoggerMiddleware() {
      return loggerMiddleware;
    }
  }]);

  return Logger;
}();



/***/ }),

/***/ "./www/js/source/reactpages/lib/numberFormat.js":
/*!******************************************************!*\
  !*** ./www/js/source/reactpages/lib/numberFormat.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NumberFormat; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NumberFormat =
/*#__PURE__*/
function () {
  function NumberFormat() {
    _classCallCheck(this, NumberFormat);
  }

  _createClass(NumberFormat, null, [{
    key: "formatDecimal",
    value: function formatDecimal(value) {
      return this.format(value, 2);
    }
  }, {
    key: "format",
    value: function format(value) {
      var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (typeof value !== "number" || isNaN(value)) {
        return "";
      }

      var roundedValue = this.round(value, digits);
      return roundedValue.toFixed(digits).replace(/(\d)(?=(\d{3})+(\.|$))/g, "$1,");
    }
  }, {
    key: "round",
    value: function round(value, digits) {
      var sign = value < 0 ? -1 : 1;
      var absoluteValue = Math.abs(value);
      var rounded = Number(Math.round(absoluteValue + 'e' + digits) + 'e-' + digits);
      return sign * rounded;
    }
  }]);

  return NumberFormat;
}();



/***/ }),

/***/ "./www/js/source/reactpages/lib/report.js":
/*!************************************************!*\
  !*** ./www/js/source/reactpages/lib/report.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Report; });
/* harmony import */ var _constants_report__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/report */ "./www/js/source/reactpages/constants/report.js");
/* harmony import */ var _site__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./site */ "./www/js/source/reactpages/lib/site.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var fetchData = function fetchData(relativeUrl, params) {
  var url = _site__WEBPACK_IMPORTED_MODULE_1__["default"].resolveClientUrl(relativeUrl);
  return axios__WEBPACK_IMPORTED_MODULE_2___default.a.post(url, params.data, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      '__RequestVerificationToken': _site__WEBPACK_IMPORTED_MODULE_1__["default"].getXsrfToken()
    }
  });
};

var Report =
/*#__PURE__*/
function () {
  function Report() {
    _classCallCheck(this, Report);
  }

  _createClass(Report, null, [{
    key: "getDrilldownDateRange",
    value: function getDrilldownDateRange(reportBy, fromDate, toDate, drilldownDate) {
      var fdate = typeof drilldownDate === "string" ? new Date(drilldownDate) : drilldownDate;
      var tdate = fdate;

      if (Number(reportBy) === _constants_report__WEBPACK_IMPORTED_MODULE_0__["ReportBy"].MONTHLY) {
        var fday = 1;
        var month = fdate.getMonth();
        var year = fdate.getFullYear();
        var orignalFDate = new Date(fromDate);

        if (month === orignalFDate.getMonth()) {
          fday = orignalFDate.getDate();
        }

        fdate = new Date(year, month, fday, 0, 0, 0, 0);
        var originalTDate = new Date(toDate);

        if (month === originalTDate.getMonth()) {
          var tday = originalTDate.getDate();
          tdate = new Date(year, month, tday, 0, 0, 0, 0);
        } else {
          tdate = new Date(year, month + 1, 0);
        }
      }

      return {
        fromDate: fdate,
        toDate: tdate
      };
    }
  }, {
    key: "fetchGridData",
    value: function fetchGridData(relativeUrl, params) {
      return fetchData(relativeUrl, params);
    }
  }]);

  return Report;
}();



/***/ }),

/***/ "./www/js/source/reactpages/lib/site.js":
/*!**********************************************!*\
  !*** ./www/js/source/reactpages/lib/site.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Site; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _rootUrl = window.rootUrl || "/";

var _xsrfToken = null;

var Site =
/*#__PURE__*/
function () {
  function Site() {
    _classCallCheck(this, Site);
  }

  _createClass(Site, null, [{
    key: "getXsrfToken",
    value: function getXsrfToken() {
      if (!_xsrfToken) {
        _xsrfToken = document.querySelector("input[name=__RequestVerificationToken]").value;
      }

      return _xsrfToken;
    }
  }, {
    key: "resolveClientUrl",
    value: function resolveClientUrl(relativeUrl) {
      return _rootUrl + relativeUrl;
    }
  }, {
    key: "convertDateToString",
    value: function convertDateToString(date) {
      return typeof date === "string" ? date : date.format("MM/DD/YYYY");
    }
  }, {
    key: "asNull",
    value: function asNull(text) {
      if (text != null) {
        text = text.trim();

        if (text === '') {
          return null;
        }
      }

      return text;
    }
  }, {
    key: "downloadFile",
    value: function downloadFile(data, fileName) {
      var url = window.URL.createObjectURL(new Blob([data]));
      var link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }, {
    key: "readAsJson",
    value: function readAsJson(blob, callback) {
      var reader = new FileReader();

      reader.onload = function () {
        callback && callback(JSON.parse(reader.result));
      };

      reader.readAsText(blob);
    }
  }]);

  return Site;
}();



/***/ }),

/***/ "./www/js/source/reactpages/lib/store.js":
/*!***********************************************!*\
  !*** ./www/js/source/reactpages/lib/store.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Store; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux-thunk */ "./node_modules/redux-thunk/lib/index.js");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux_thunk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger */ "./www/js/source/reactpages/lib/logger.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var Store =
/*#__PURE__*/
function () {
  function Store() {
    _classCallCheck(this, Store);
  }

  _createClass(Store, null, [{
    key: "createStore",
    value: function createStore(reducer, initialState) {
      var loggerMiddleware = _logger__WEBPACK_IMPORTED_MODULE_2__["default"].getLoggerMiddleware();
      var enhancer = Object(redux__WEBPACK_IMPORTED_MODULE_0__["compose"])(Object(redux__WEBPACK_IMPORTED_MODULE_0__["applyMiddleware"])(redux_thunk__WEBPACK_IMPORTED_MODULE_1___default.a, // lets us dispatch() functions
      loggerMiddleware));
      return Object(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(reducer, initialState, enhancer);
    }
  }]);

  return Store;
}();



/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/actions/dataHandlerAction.js":
/*!********************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/actions/dataHandlerAction.js ***!
  \********************************************************************************/
/*! exports provided: getGridData, exportExcel, setGridData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGridData", function() { return getGridData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportExcel", function() { return exportExcel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setGridData", function() { return setGridData; });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./www/js/source/reactpages/pages/exchangewl/actions/types.js");
/* harmony import */ var _jsroot_lib_report__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jsroot/lib/report */ "./www/js/source/reactpages/lib/report.js");


var relativeUrl = 'api/ExchangeWinLossReport/Index';
function getGridData(params, errorHandler) {
  return function (dispatch) {
    _jsroot_lib_report__WEBPACK_IMPORTED_MODULE_1__["default"].fetchGridData(relativeUrl, params).then(function (response) {
      dispatch(setGridData({
        level: params.data.Level,
        data: response.data
      }));
    }).catch(function (error) {
      return errorHandler(error);
    });
  };
}
function exportExcel(params) {
  return function () {
    return _jsroot_lib_report__WEBPACK_IMPORTED_MODULE_1__["default"].fetchGridData(relativeUrl, params);
  };
}
function setGridData(data) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["SET_GRID_DATA"],
    data: data
  };
}

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/actions/filterHandlerAction.js":
/*!**********************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/actions/filterHandlerAction.js ***!
  \**********************************************************************************/
/*! exports provided: setReportBy, setParams */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setReportBy", function() { return setReportBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setParams", function() { return setParams; });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./www/js/source/reactpages/pages/exchangewl/actions/types.js");

var setReportBy = function setReportBy(value) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["SET_REPORTBY"],
    data: value
  };
};
var setParams = function setParams(value) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["SET_PARAM"],
    data: value
  };
};

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/actions/index.js":
/*!********************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/actions/index.js ***!
  \********************************************************************/
/*! exports provided: ActionCreators */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionCreators", function() { return ActionCreators; });
/* harmony import */ var _dataHandlerAction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dataHandlerAction.js */ "./www/js/source/reactpages/pages/exchangewl/actions/dataHandlerAction.js");
/* harmony import */ var _filterHandlerAction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filterHandlerAction.js */ "./www/js/source/reactpages/pages/exchangewl/actions/filterHandlerAction.js");
/* harmony import */ var _actions_currencyAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../actions/currencyAction */ "./www/js/source/reactpages/actions/currencyAction.js");
/* harmony import */ var _actions_loaderAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../actions/loaderAction */ "./www/js/source/reactpages/actions/loaderAction.js");
/* harmony import */ var _actions_excludeTestAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../actions/excludeTestAction */ "./www/js/source/reactpages/actions/excludeTestAction.js");
/* harmony import */ var _actions_dateRangeAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/dateRangeAction */ "./www/js/source/reactpages/actions/dateRangeAction.js");






var ActionCreators = Object.assign({}, _dataHandlerAction_js__WEBPACK_IMPORTED_MODULE_0__, _filterHandlerAction_js__WEBPACK_IMPORTED_MODULE_1__, _actions_currencyAction__WEBPACK_IMPORTED_MODULE_2__, _actions_loaderAction__WEBPACK_IMPORTED_MODULE_3__, _actions_excludeTestAction__WEBPACK_IMPORTED_MODULE_4__, _actions_dateRangeAction__WEBPACK_IMPORTED_MODULE_5__);

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/actions/types.js":
/*!********************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/actions/types.js ***!
  \********************************************************************/
/*! exports provided: FETCH_DATA, SET_GRID_DATA, GET_REPORTBY, SET_REPORTBY, SET_PARAM, GET_LICENSEE, GET_ISALLOWED_CUSTOMERCOMM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_DATA", function() { return FETCH_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_GRID_DATA", function() { return SET_GRID_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_REPORTBY", function() { return GET_REPORTBY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_REPORTBY", function() { return SET_REPORTBY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_PARAM", function() { return SET_PARAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_LICENSEE", function() { return GET_LICENSEE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_ISALLOWED_CUSTOMERCOMM", function() { return GET_ISALLOWED_CUSTOMERCOMM; });
var FETCH_DATA = 'FETCH_DATA';
var SET_GRID_DATA = 'SET_GRID_DATA';
var GET_REPORTBY = 'GET_REPORTBY';
var SET_REPORTBY = 'SET_REPORTBY';
var SET_PARAM = 'SET_PARAM';
var GET_LICENSEE = 'GET_LICENSEE';
var GET_ISALLOWED_CUSTOMERCOMM = 'GET_ISALLOWED_CUSTOMERCOMM';

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/components/AppContainer.jsx":
/*!*******************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/components/AppContainer.jsx ***!
  \*******************************************************************************/
/*! exports provided: AppContainer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppContainer", function() { return AppContainer; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _actions_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/index */ "./www/js/source/reactpages/pages/exchangewl/actions/index.js");
/* harmony import */ var _DataGrid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DataGrid */ "./www/js/source/reactpages/pages/exchangewl/components/DataGrid.jsx");
/* harmony import */ var _FormFilter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FormFilter */ "./www/js/source/reactpages/pages/exchangewl/components/FormFilter.jsx");
/* harmony import */ var _jsroot_components_Loader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jsroot/components/Loader */ "./www/js/source/reactpages/components/Loader.jsx");
/* harmony import */ var _jsroot_layouts_AppLayout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jsroot/layouts/AppLayout */ "./www/js/source/reactpages/layouts/AppLayout.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }









var AppContainer =
/*#__PURE__*/
function (_Component) {
  _inherits(AppContainer, _Component);

  function AppContainer(props) {
    _classCallCheck(this, AppContainer);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppContainer).call(this, props));
  }

  _createClass(AppContainer, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_jsroot_layouts_AppLayout__WEBPACK_IMPORTED_MODULE_7__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_jsroot_components_Loader__WEBPACK_IMPORTED_MODULE_6__["default"], {
        isLoading: this.props.isLoading
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_FormFilter__WEBPACK_IMPORTED_MODULE_5__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DataGrid__WEBPACK_IMPORTED_MODULE_4__["default"], null));
    }
  }]);

  return AppContainer;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

function mapStateToProps(state) {
  return Object.assign({}, {
    isLoading: state.isLoading
  });
}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps)(AppContainer));

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/components/BetList.jsx":
/*!**************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/components/BetList.jsx ***!
  \**************************************************************************/
/*! exports provided: BetList, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BetList", function() { return BetList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _layouts_BetListPopupLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../layouts/BetListPopupLayout */ "./www/js/source/reactpages/layouts/BetListPopupLayout.jsx");
/* harmony import */ var _components_NoDataTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../components/NoDataTitle */ "./www/js/source/reactpages/components/NoDataTitle.jsx");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @9softstudio/react-grid */ "./node_modules/@9softstudio/react-grid/dist/index.js");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_popup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../components/popup */ "./www/js/source/reactpages/components/popup/index.jsx");
/* harmony import */ var _BetListDetail__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./BetListDetail */ "./www/js/source/reactpages/pages/exchangewl/components/BetListDetail.jsx");
/* harmony import */ var _lib_report__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../lib/report */ "./www/js/source/reactpages/lib/report.js");
/* harmony import */ var _lib_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/service */ "./www/js/source/reactpages/pages/exchangewl/lib/service.js");
/* harmony import */ var _actions_loaderAction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../actions/loaderAction */ "./www/js/source/reactpages/actions/loaderAction.js");
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../lib/numberFormat */ "./www/js/source/reactpages/lib/numberFormat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }















var BetList =
/*#__PURE__*/
function (_Component) {
  _inherits(BetList, _Component);

  function BetList(props) {
    var _this;

    _classCallCheck(this, BetList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BetList).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_showTicketDetail", function (betId, type) {
      var _this$props$params = _this.props.params,
          CustId = _this$props$params.CustId,
          CurrencyId = _this$props$params.CurrencyId,
          BaseCurrency = _this$props$params.BaseCurrency,
          ExcludeTestData = _this$props$params.ExcludeTestData;
      var url = "api/ExchangeWinLossBetList/Detail";
      var params = {
        data: {
          CustId: CustId,
          CurrencyId: CurrencyId,
          BaseCurrency: BaseCurrency,
          ExcludeTestData: ExcludeTestData,
          betId: betId,
          type: type
        }
      };

      _this.props.toggleLoader(true);

      _lib_report__WEBPACK_IMPORTED_MODULE_9__["default"].fetchGridData(url, params).then(function (response) {
        _this.setState({
          showDetail: true,
          detailData: response.data
        });

        _this.props.toggleLoader(false);
      }).catch(function (error) {
        _lib_service__WEBPACK_IMPORTED_MODULE_10__["Service"].showErrorMsg();

        _this.props.toggleLoader(false);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeDetailPopup", function () {
      _this.setState({
        showDetail: false,
        detailData: null
      });
    });

    _this.state = {
      showDetail: false,
      detailData: null
    };
    return _this;
  }

  _createClass(BetList, [{
    key: "_buildHeader",
    value: function _buildHeader() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderRow"], {
        style: {
          height: 32
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 40
      }, "#"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 300
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("Market")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 70
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("BetId")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 120
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("Selection")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 50
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("Type")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 100
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("BetPlaced")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 60
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("OddsAvg")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 80
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("Stake")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 80
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("WinLoss")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["HeaderCell"], {
        colWidth: 100
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("WL"), "/", _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("Comm")));
    }
  }, {
    key: "_buildBody",
    value: function _buildBody() {
      var _this2 = this;

      var MainData = this.props.data.MainData;
      var rows = [];

      for (var i = 0; i < MainData.length; i++) {
        var _MainData$i = MainData[i],
            Ticket = _MainData$i.Ticket,
            Details = _MainData$i.Details;
        var MarketName = Ticket.MarketName,
            EventTypeName = Ticket.EventTypeName,
            EventName = Ticket.EventName,
            WinLost = Ticket.WinLost,
            Commission = Ticket.Commission;
        var dataDetailCount = Details.length;
        var WinLostSumString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__["default"].formatDecimal(WinLost);
        var CommissionString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__["default"].formatDecimal(Commission);
        var isFirstRow = true;
        var marketText = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, EventTypeName, " > ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-bold"
        }, EventName), " > ", MarketName);

        var _loop = function _loop(j) {
          var _Details$j = Details[j],
              BetId = _Details$j.BetId,
              SelectionName = _Details$j.SelectionName,
              Type = _Details$j.Type,
              BetPlacedDateString = _Details$j.BetPlacedDateString,
              OddsAvg = _Details$j.OddsAvg,
              Stake = _Details$j.Stake;
          var OddsAvgString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__["default"].formatDecimal(OddsAvg);
          var StakeString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__["default"].formatDecimal(Stake);
          var WinLostDetailString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__["default"].formatDecimal(Details[j].WinLost);
          rows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Row"], {
            key: "row-".concat(i, "-").concat(j)
          }, isFirstRow && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: i + 1,
            rowSpan: dataDetailCount,
            className: "center-align"
          }, i + 1), isFirstRow && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: "".concat(EventTypeName, " > ").concat(EventName, " > ").concat(MarketName),
            rowSpan: dataDetailCount
          }, marketText), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: BetId,
            className: "center-align"
          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            href: "javascript:;",
            onClick: function onClick() {
              return _this2._showTicketDetail(BetId, Type);
            }
          }, BetId)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: SelectionName,
            className: "center-align"
          }, SelectionName), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: Type,
            className: "center-align ".concat(Type.toLowerCase() === "lay" ? "negative" : "")
          }, Type), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: BetPlacedDateString,
            className: "center-align"
          }, BetPlacedDateString), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: OddsAvgString,
            className: "right-align"
          }, OddsAvgString), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: StakeString,
            className: "right-align"
          }, _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__["default"].formatDecimal(Stake)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: WinLostDetailString,
            className: "right-align"
          }, WinLostDetailString), isFirstRow && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
            title: "".concat(WinLostSumString, "/").concat(CommissionString),
            rowSpan: dataDetailCount,
            className: "right-align"
          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
            className: WinLost < 0 ? "negative" : ""
          }, WinLostSumString), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
            className: Commission < 0 ? "negative" : ""
          }, CommissionString))));
          isFirstRow = false;
        };

        for (var j = 0; j < Details.length; j++) {
          _loop(j);
        }
      }

      return rows;
    }
  }, {
    key: "_buildFooter",
    value: function _buildFooter() {
      var GrandTotalString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_13__["default"].formatDecimal(this.props.data.GrandTotal);
      return [react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Row"], {
        key: "betlist-footer"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
        colSpan: "9",
        className: "right-align"
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("GrandTotal")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Cell"], {
        title: GrandTotalString,
        className: "right-align ".concat(this.props.data.GrandTotal < 0 ? "negative" : "")
      }, GrandTotalString))];
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          showDetail = _this$state.showDetail,
          detailData = _this$state.detailData;
      var MainData = this.props.data.MainData;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_layouts_BetListPopupLayout__WEBPACK_IMPORTED_MODULE_4__["default"], {
        title: this.props.title
      }, MainData && MainData.length ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_6__["Table"], {
        autoWidth: false,
        autoHeight: false,
        width: 870,
        bodyHeight: 430,
        header: this._buildHeader(),
        body: this._buildBody(),
        footer: this._buildFooter()
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_NoDataTitle__WEBPACK_IMPORTED_MODULE_5__["default"], null)), showDetail && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_popup__WEBPACK_IMPORTED_MODULE_7__["default"], {
        isShow: showDetail,
        title: _lib_langHelper__WEBPACK_IMPORTED_MODULE_12__["default"].getSingleResource("Details"),
        width: 730,
        height: 450,
        onClose: this.closeDetailPopup
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_BetListDetail__WEBPACK_IMPORTED_MODULE_8__["default"], {
        data: detailData
      })));
    }
  }]);

  return BetList;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(BetList, "propTypes", {
  data: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.shape({
    MainData: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.object),
    GrandTotal: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.number
  }),
  title: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.any,
  params: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.object.isRequired
});

function mapDispatchToProps(dispatch) {
  return Object(redux__WEBPACK_IMPORTED_MODULE_2__["bindActionCreators"])({
    toggleLoader: _actions_loaderAction__WEBPACK_IMPORTED_MODULE_11__["toggleLoader"]
  }, dispatch);
}

;

function mapStateToProps(state) {
  return {};
}

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(BetList));

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/components/BetListDetail.jsx":
/*!********************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/components/BetListDetail.jsx ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BetListDetail; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_NoDataTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/NoDataTitle */ "./www/js/source/reactpages/components/NoDataTitle.jsx");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @9softstudio/react-grid */ "./node_modules/@9softstudio/react-grid/dist/index.js");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../lib/numberFormat */ "./www/js/source/reactpages/lib/numberFormat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var BetListDetail =
/*#__PURE__*/
function (_Component) {
  _inherits(BetListDetail, _Component);

  function BetListDetail(props) {
    _classCallCheck(this, BetListDetail);

    return _possibleConstructorReturn(this, _getPrototypeOf(BetListDetail).call(this, props));
  }

  _createClass(BetListDetail, [{
    key: "_buildHeader",
    value: function _buildHeader() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["HeaderRow"], {
        style: {
          height: 32
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["HeaderCell"], {
        colWidth: 100
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_4__["default"].getSingleResource("BetTaken")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["HeaderCell"], {
        colWidth: 70
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_4__["default"].getSingleResource("OddsReq")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["HeaderCell"], {
        colWidth: 70
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_4__["default"].getSingleResource("Stake")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["HeaderCell"], {
        colWidth: 70
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_4__["default"].getSingleResource("Liability")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["HeaderCell"], {
        colWidth: 70
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_4__["default"].getSingleResource("OddsMatched")));
    }
  }, {
    key: "_buildBody",
    value: function _buildBody() {
      var data = this.props.data;
      var rows = [];

      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var OddsReqString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(dataItem.OddsReq);
        var StakeString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(dataItem.Stake);
        var OddsMatchedString = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(dataItem.OddsMatched);
        rows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["Row"], {
          key: "rowDetail-".concat(i)
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["Cell"], {
          title: dataItem.BetTakenDateString,
          className: "center-align"
        }, dataItem.BetTakenDateString), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["Cell"], {
          title: OddsReqString,
          className: "right-align"
        }, OddsReqString), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["Cell"], {
          title: StakeString,
          className: "right-align"
        }, StakeString), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["Cell"], {
          title: dataItem.Liability,
          className: "right-align"
        }, dataItem.Liability), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["Cell"], {
          title: OddsMatchedString,
          className: "right-align"
        }, OddsMatchedString)));
      }

      return rows;
    }
  }, {
    key: "render",
    value: function render() {
      var data = this.props.data;
      return data && data.length ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "popup-content-default popup-detail-default"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_3__["Table"], {
        autoWidth: false,
        autoHeight: false,
        width: 700,
        bodyHeight: 350,
        header: this._buildHeader(),
        body: this._buildBody()
      })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_NoDataTitle__WEBPACK_IMPORTED_MODULE_2__["default"], null);
    }
  }]);

  return BetListDetail;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(BetListDetail, "propTypes", {
  data: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object).isRequired
});



/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/components/DataGrid.jsx":
/*!***************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/components/DataGrid.jsx ***!
  \***************************************************************************/
/*! exports provided: DataGrid, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataGrid", function() { return DataGrid; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/index.js */ "./www/js/source/reactpages/pages/exchangewl/actions/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @9softstudio/react-grid */ "./node_modules/@9softstudio/react-grid/dist/index.js");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../lib/numberFormat */ "./www/js/source/reactpages/lib/numberFormat.js");
/* harmony import */ var _components_ReportTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../components/ReportTitle */ "./www/js/source/reactpages/components/ReportTitle.jsx");
/* harmony import */ var _lib_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/service */ "./www/js/source/reactpages/pages/exchangewl/lib/service.js");
/* harmony import */ var _constants_report__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../constants/report */ "./www/js/source/reactpages/constants/report.js");
/* harmony import */ var _constants_licensee__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../constants/licensee */ "./www/js/source/reactpages/constants/licensee.js");
/* harmony import */ var _components_NoDataTitle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../components/NoDataTitle */ "./www/js/source/reactpages/components/NoDataTitle.jsx");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _9softstudio_react_breadcrumb__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @9softstudio/react-breadcrumb */ "./node_modules/@9softstudio/react-breadcrumb/dist/index.js");
/* harmony import */ var _9softstudio_react_breadcrumb__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_9softstudio_react_breadcrumb__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _lib_site__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../lib/site */ "./www/js/source/reactpages/lib/site.js");
/* harmony import */ var _BetList__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./BetList */ "./www/js/source/reactpages/pages/exchangewl/components/BetList.jsx");
/* harmony import */ var _components_popup__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../components/popup */ "./www/js/source/reactpages/components/popup/index.jsx");
/* harmony import */ var _lib_report__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../lib/report */ "./www/js/source/reactpages/lib/report.js");
/* harmony import */ var _lib_langHelper_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../lib/langHelper.js */ "./www/js/source/reactpages/lib/langHelper.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



















var CUSTOMER_BETLIST_TEXT = _lib_langHelper_js__WEBPACK_IMPORTED_MODULE_17__["default"].getSingleResource("CustomerBetList");
var DataGrid =
/*#__PURE__*/
function (_Component) {
  _inherits(DataGrid, _Component);

  function DataGrid(props) {
    var _this;

    _classCallCheck(this, DataGrid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataGrid).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "showBetListPopup", function (externalId, systemId, custId) {
      var _this$drillDownParams = _this.drillDownParams[_constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER],
          CurrencyId = _this$drillDownParams.CurrencyId,
          BaseCurrency = _this$drillDownParams.BaseCurrency,
          FromDate = _this$drillDownParams.FromDate,
          ToDate = _this$drillDownParams.ToDate,
          CurrencyName = _this$drillDownParams.CurrencyName,
          ExcludeTestData = _this$drillDownParams.ExcludeTestData;
      var url = "api/ExchangeWinLossBetList/Index";
      _this.betlistParams = {
        CustId: custId,
        CurrencyId: CurrencyId,
        BaseCurrency: BaseCurrency,
        FromDate: FromDate,
        ToDate: ToDate,
        ExcludeTestData: ExcludeTestData
      };
      var params = {
        data: _this.betlistParams
      };
      var viewIn = _lib_langHelper_js__WEBPACK_IMPORTED_MODULE_17__["default"].getSingleResource("Viewin").replace("{0}", BaseCurrency ? BaseCurrency : CurrencyName);
      _this.betlistTitle = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, CUSTOMER_BETLIST_TEXT, " ", FromDate, " \u2192 ", ToDate, " - ", externalId, "(", systemId, ") -", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "base-currency-title"
      }, viewIn));

      _this.props.toggleLoader(true);

      _lib_report__WEBPACK_IMPORTED_MODULE_16__["default"].fetchGridData(url, params).then(function (response) {
        _this.setState({
          showBetList: true,
          betListData: response.data
        });

        _this.props.toggleLoader(false);
      }).catch(function (error) {
        _lib_service__WEBPACK_IMPORTED_MODULE_7__["Service"].showErrorMsg();

        _this.props.toggleLoader(false);
      });
      window.logOpenBetlistEvent && window.logOpenBetlistEvent();
    });

    _defineProperty(_assertThisInitialized(_this), "closeBetListPopup", function () {
      _this.setState({
        showBetList: false,
        betListData: null
      });
    });

    _this.isAllowedCustomerComm = props.isAllowedCustomerComm;
    _this.licenseeId = props.licenseeId;
    _this.levelGridData = [];
    _this.drillDownParams = [];
    _this.betlistTitle = null;
    _this.betlistParams = {};
    _this.state = {
      showBetList: false,
      betListData: {}
    };
    return _this;
  }

  _createClass(DataGrid, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.params !== prevProps.params) {
        this.drillDownParams[_constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN] = this.props.params;
      }

      if (this.props.gridData !== prevProps.gridData) {
        this.props.toggleLoader(false);
      }
    }
  }, {
    key: "_getColSpan",
    value: function _getColSpan(level) {
      switch (level) {
        case _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN:
          return 2;

        case _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].LICENSEE:
          return 2;

        case _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER:
          return 3;

        default:
          return 2;
      }
    }
  }, {
    key: "_getDrillDownParams",
    value: function _getDrillDownParams(level, date, currencyId, currencyName, custId) {
      var mainParam = this.drillDownParams[_constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN];

      if (!mainParam) {
        return null;
      }

      var drillDownDate = _lib_service__WEBPACK_IMPORTED_MODULE_7__["Service"].getDrilldownDateRange(mainParam.ReportBy, mainParam.FromDate, mainParam.ToDate, date);

      var drillDownData = _objectSpread({}, mainParam, {
        CurrencyId: currencyId,
        CurrencyName: currencyName,
        FromDate: _lib_site__WEBPACK_IMPORTED_MODULE_13__["default"].convertDateToString(moment__WEBPACK_IMPORTED_MODULE_11___default()(drillDownDate.fromDate)),
        ToDate: _lib_site__WEBPACK_IMPORTED_MODULE_13__["default"].convertDateToString(moment__WEBPACK_IMPORTED_MODULE_11___default()(drillDownDate.toDate)),
        Level: level,
        CustId: custId
      });

      this.drillDownParams[level] = drillDownData;
      return {
        data: drillDownData
      };
    }
  }, {
    key: "_drillDownData",
    value: function _drillDownData(level, date, currencyId, currencyName, custId) {
      var _this2 = this;

      var currentLevel = this.props.gridData.level;

      if (currentLevel === level || level < _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN || level > _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER) {
        return;
      }

      if (level > currentLevel) {
        var params = this._getDrillDownParams(level, date, currencyId, currencyName, custId);

        if (!params) {
          return;
        }

        this.props.toggleLoader(true);
        this.levelGridData[currentLevel] = this.props.gridData.data;
        this.props.getGridData(params, function () {
          _lib_service__WEBPACK_IMPORTED_MODULE_7__["Service"].showErrorMsg();

          _this2.props.toggleLoader(false);
        });
      } else {
        var data = this.levelGridData[level];

        if (!data) {
          return;
        }

        this.props.toggleLoader(true);
        this.props.setGridData({
          data: data,
          level: level
        });
      }
    }
  }, {
    key: "_renderDrillDownLink",
    value: function _renderDrillDownLink(text, level, date, currencyId, currencyName, custId) {
      var _this3 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: function onClick() {
          return _this3._drillDownData(level, date, currencyId, currencyName, custId);
        },
        href: "javascript:;"
      }, text);
    }
  }, {
    key: "_buildHeader",
    value: function _buildHeader(level, reportBy) {
      var headerRows = [];
      headerRows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderRow"], {
        style: {
          height: 32
        },
        key: "tr-header1"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 30,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].index,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].index), level === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportBy"].DAILY ? _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].date : _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].month,
        rowSpan: "2"
      }, reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportBy"].DAILY ? _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].date : _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].month), level === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].externalId,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].externalId), level !== _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].systemId,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].systemId), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 70,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].currency,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].currency), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].turnover,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].turnover), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].netTurnover,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].netTurnover), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 80,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].totalTransaction,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].totalTransaction), this.isAllowedCustomerComm ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customer,
        colSpan: "3"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customer) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customerWL,
        rowSpan: "2"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customerWL), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
        colWidth: 100,
        title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licensee,
        colSpan: "4"
      }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licensee)));

      if (this.isAllowedCustomerComm) {
        headerRows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderRow"], {
          style: {
            height: 32
          },
          key: "tr-header2"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customerWL
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customerWL), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customerComm
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].customerComm), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].total
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].total), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeWL
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeWL), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].amountDueTo
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].amountDueTo), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeComm
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeComm), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].total
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].total)));
      } else {
        headerRows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderRow"], {
          style: {
            height: 32
          },
          key: "tr-header2"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeWL
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeWL), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].amountDueTo
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].amountDueTo), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeComm
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].licenseeComm), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["HeaderCell"], {
          colWidth: 100,
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].total
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["HeaderText"].total)));
      }

      return headerRows;
    }
  }, {
    key: "_buildBody",
    value: function _buildBody(level, reportBy) {
      var data = this.props.gridData.data.DataList;
      var rows = [];

      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var date = moment__WEBPACK_IMPORTED_MODULE_11___default()(item.Date).format(reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportBy"].DAILY ? "MM/DD/YYYY" : "MM/YYYY");
        rows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Row"], {
          key: "tr-main".concat(i)
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: i + 1,
          className: "center-align"
        }, i + 1), level === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: date,
          className: "center-align"
        }, date), level === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: item.ExternalId,
          className: "left-align"
        }, this._renderBetListLink(item.ExternalId, item.ExternalId, item.SystemId, item.CustId)), level !== _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: item.SystemId,
          className: "left-align"
        }, level === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].LICENSEE ? this._renderDrillDownLink(item.SystemId, _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER, item.Date, item.CurrencyId, item.CurrencyName, item.CustId) : this._renderBetListLink(item.SystemId, item.ExternalId, item.SystemId, item.CustId)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: item.CurrencyName,
          className: "center-align"
        }, level === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN ? this._renderDrillDownLink(item.CurrencyName, this.licenseeId === _constants_licensee__WEBPACK_IMPORTED_MODULE_9__["Licensee"].ONE_TWO_BET ? _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].LICENSEE : _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER, item.Date, item.CurrencyId, item.CurrencyName) : item.CurrencyName), this._buildCell(item)));
      }

      return rows;
    }
  }, {
    key: "_buildFooter",
    value: function _buildFooter(level) {
      var totalRows = [];

      var data = this.props.gridData.data.TotalDataList,
          colSpan = this._getColSpan(level),
          rowSpan = data.length;

      for (var i = 0; i < rowSpan; i++) {
        var item = data[i];
        totalRows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Row"], {
          key: "tr-total".concat(i),
          className: "fixed-table-total"
        }, i === 0 && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: _lib_service__WEBPACK_IMPORTED_MODULE_7__["TotalText"].total,
          className: "center-align",
          rowSpan: rowSpan,
          colSpan: colSpan
        }, _lib_service__WEBPACK_IMPORTED_MODULE_7__["TotalText"].total), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: item.CurrencyName,
          className: "center-align"
        }, item.CurrencyName), this._buildCell(item)));
      }

      var dataSummary = this.props.gridData.data.SummaryTotal,
          baseCurrencyList = Object.keys(dataSummary),
          colSummarySpan = this._getColSpan(level) + 1;

      for (var _i = baseCurrencyList.length - 1; _i >= 0; _i--) {
        var currency = baseCurrencyList[_i],
            _item = dataSummary[currency];
        totalRows.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Row"], {
          key: "tr-grandtotal".concat(_i),
          className: "fixed-table-grant-total"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
          title: "".concat(_lib_service__WEBPACK_IMPORTED_MODULE_7__["TotalText"].totalIn, " ").concat(currency),
          className: "center-align",
          colSpan: colSummarySpan
        }, "".concat(_lib_service__WEBPACK_IMPORTED_MODULE_7__["TotalText"].totalIn, " ").concat(currency)), this._buildCell(_item)));
      }

      return totalRows;
    }
  }, {
    key: "_buildCell",
    value: function _buildCell(item) {
      var turnover = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.Turnover),
          netTurnover = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.NetTurnover),
          totalTransaction = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].format(item.TotalTransaction),
          customerWL = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.CustomerWL),
          customerComm = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.CustomerComm),
          customerWLTotal = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.CustomerWLTotal),
          licenseeWL = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.LicenseeWL),
          amountDueTo = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.AmountDueTo),
          licenseeComm = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.LicenseeComm),
          licenseeWLTotal = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_5__["default"].formatDecimal(item.LicenseeWLTotal);
      var cells = [react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "turnover",
        title: turnover,
        className: "right-align"
      }, turnover), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "netturnover",
        title: netTurnover,
        className: "right-align"
      }, netTurnover), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "totalTransaction",
        title: totalTransaction,
        className: "right-align"
      }, totalTransaction), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "customerWL",
        title: customerWL,
        className: "right-align"
      }, customerWL), this.isAllowedCustomerComm && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "customerComm",
        title: customerComm,
        className: "right-align"
      }, customerComm), this.isAllowedCustomerComm && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "customerWLTotal",
        title: customerWLTotal,
        className: "right-align"
      }, customerWLTotal), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "licenseeWL",
        title: licenseeWL,
        className: "right-align ".concat(item.LicenseeWL < 0 ? 'negative' : '')
      }, licenseeWL), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "amountDueTo",
        title: amountDueTo,
        className: "right-align"
      }, amountDueTo), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "licenseeComm",
        title: licenseeComm,
        className: "right-align"
      }, licenseeComm), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Cell"], {
        key: "licenseeWLTotal",
        title: licenseeWLTotal,
        className: "right-align ".concat(item.LicenseeWLTotal < 0 ? 'negative' : '')
      }, licenseeWLTotal)];
      return cells;
    }
  }, {
    key: "_renderBreadcrumb",
    value: function _renderBreadcrumb() {
      var _this4 = this;

      var items = [{
        label: _lib_service__WEBPACK_IMPORTED_MODULE_7__["BreadcrumbText"].main,
        value: _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN
      }];

      if (Number(this.licenseeId) === _constants_licensee__WEBPACK_IMPORTED_MODULE_9__["Licensee"].ONE_TWO_BET) {
        items.push({
          label: _lib_service__WEBPACK_IMPORTED_MODULE_7__["BreadcrumbText"].licensee,
          value: _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].LICENSEE
        });
      }

      items.push({
        label: _lib_service__WEBPACK_IMPORTED_MODULE_7__["BreadcrumbText"].customer,
        value: _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_breadcrumb__WEBPACK_IMPORTED_MODULE_12__["Breadcrumb"], {
        items: items,
        value: this.props.gridData.level,
        onChange: function onChange(item) {
          return _this4._drillDownData(item.value);
        }
      });
    }
  }, {
    key: "_renderNodata",
    value: function _renderNodata(title) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "result-content"
      }, this._renderBreadcrumb(), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ReportTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
        content: title
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_NoDataTitle__WEBPACK_IMPORTED_MODULE_10__["default"], null));
    }
  }, {
    key: "_renderBetListLink",
    value: function _renderBetListLink(text, externalId, systemId, custId) {
      var _this5 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: function onClick() {
          return _this5.showBetListPopup(externalId, systemId, custId);
        }
      }, text);
    }
  }, {
    key: "render",
    value: function render() {
      var gridData = this.props.gridData;

      if (!gridData || !gridData.data) {
        return null;
      }

      var reportLevel = gridData.level;
      var params = this.drillDownParams[reportLevel];
      var title = _lib_service__WEBPACK_IMPORTED_MODULE_7__["Service"].getReportTitle({
        fromDate: params.FromDate,
        toDate: params.ToDate
      }, params.BaseCurrency ? params.BaseCurrency : params.CurrencyName, reportLevel === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].MAIN ? params.CurrencyId === 0 : false);

      if (!gridData.data.DataList.length) {
        return this._renderNodata(title);
      }

      var reportBy = this.props.params.ReportBy;
      var _this$state = this.state,
          showBetList = _this$state.showBetList,
          betListData = _this$state.betListData;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "result-content"
      }, this._renderBreadcrumb(), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ReportTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
        content: title
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_4__["Table"], {
        minWidth: 1000,
        autoWidth: true,
        bodyHeight: 300,
        header: this._buildHeader(reportLevel, reportBy),
        body: this._buildBody(reportLevel, reportBy),
        footer: this._buildFooter(reportLevel)
      }), reportLevel === _constants_report__WEBPACK_IMPORTED_MODULE_8__["ReportLevel"].CUSTOMER && showBetList && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_popup__WEBPACK_IMPORTED_MODULE_15__["default"], {
        isShow: showBetList,
        title: CUSTOMER_BETLIST_TEXT,
        width: 900,
        height: 600,
        onClose: this.closeBetListPopup
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_BetList__WEBPACK_IMPORTED_MODULE_14__["default"], {
        data: betListData,
        title: this.betlistTitle,
        params: this.betlistParams
      })));
    }
  }]);

  return DataGrid;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

function mapDispatchToProps(dispatch) {
  return Object(redux__WEBPACK_IMPORTED_MODULE_3__["bindActionCreators"])(_actions_index_js__WEBPACK_IMPORTED_MODULE_2__["ActionCreators"], dispatch);
}

;

function mapStateToProps(state) {
  var gridData = state.gridData,
      params = state.params,
      licenseeId = state.licenseeId,
      isAllowedCustomerComm = state.isAllowedCustomerComm;
  return Object.assign({}, {
    gridData: gridData,
    params: params,
    licenseeId: licenseeId,
    isAllowedCustomerComm: isAllowedCustomerComm
  });
}

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(DataGrid));

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/components/FormFilter.jsx":
/*!*****************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/components/FormFilter.jsx ***!
  \*****************************************************************************/
/*! exports provided: FormFilter, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormFilter", function() { return FormFilter; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/index.js */ "./www/js/source/reactpages/pages/exchangewl/actions/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.es.js");
/* harmony import */ var _components_date_range_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../components/date-range/index */ "./www/js/source/reactpages/components/date-range/index.js");
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jsroot/lib/site */ "./www/js/source/reactpages/lib/site.js");
/* harmony import */ var _jsroot_lib_AppData__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @jsroot/lib/AppData */ "./www/js/source/reactpages/lib/AppData.js");
/* harmony import */ var _constants_report__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../constants/report */ "./www/js/source/reactpages/constants/report.js");
/* harmony import */ var _constants_currency__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../constants/currency */ "./www/js/source/reactpages/constants/currency.js");
/* harmony import */ var _lib_reportExcel__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../lib/reportExcel */ "./www/js/source/reactpages/pages/exchangewl/lib/reportExcel.js");
/* harmony import */ var _lib_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../lib/service */ "./www/js/source/reactpages/pages/exchangewl/lib/service.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_13__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }















var RANGE_MONTH_CONSTRAINT = 3;
var FormFilter =
/*#__PURE__*/
function (_Component) {
  _inherits(FormFilter, _Component);

  function FormFilter(props) {
    var _this;

    _classCallCheck(this, FormFilter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormFilter).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "submit", function (event) {
      event.preventDefault();

      var params = _this._getParams();

      if (!params) {
        return;
      }

      _this.props.toggleLoader(true);

      _this.props.getGridData(params, function () {
        _lib_service__WEBPACK_IMPORTED_MODULE_12__["Service"].showErrorMsg();

        _this.props.toggleLoader(false);
      });

      _this.props.setParams(params.data);
    });

    _defineProperty(_assertThisInitialized(_this), "exportExcel", function (event) {
      event.preventDefault();
      var level = _this.props.gridData.level || 0;
      var isAllowedCustomerComm = _this.props.isAllowedCustomerComm;

      var params = _this._getParams();

      if (!params) {
        return;
      }

      _this.props.toggleLoader(true);

      if (level === _constants_report__WEBPACK_IMPORTED_MODULE_9__["ReportLevel"].MAIN) {
        _this.props.exportExcel(params).then(function (response) {
          return _this._doExportExcel(level, params.data, isAllowedCustomerComm, response.data);
        }).catch(function () {
          _lib_service__WEBPACK_IMPORTED_MODULE_12__["Service"].showErrorMsg();

          _this.props.toggleLoader(false);
        });
      } else {
        _this._doExportExcel(level, params.data, isAllowedCustomerComm, _this.props.gridData.data);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "applyDateRangeHandler", function (date) {
      var isValidMonthRange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (isValidMonthRange) {
        _this.props.setDateRange(date);
      } else {
        var message = _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('DateRangeExceedMsg').replace('{0}', RANGE_MONTH_CONSTRAINT);
        alert(message);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "changeReportBy", function (event) {
      var newValue = parseInt(event.target.value, 10);

      if (!isNaN(newValue) && _this.props.selectedReportBy !== newValue) {
        _this.props.setReportBy(newValue);
      }
    });

    return _this;
  }

  _createClass(FormFilter, [{
    key: "_doExportExcel",
    value: function _doExportExcel(level, params, isAllowedCustomerComm, gridData) {
      var _this2 = this;

      if (!gridData || !gridData.DataList.length) {
        this.props.toggleLoader(false);
        alert(_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource("NoInfo"));
        return;
      }

      var excelData;

      if (level === _constants_report__WEBPACK_IMPORTED_MODULE_9__["ReportLevel"].MAIN) {
        excelData = params;
      } else {
        var firstRow = gridData.DataList[0];
        var drillDownDate = _lib_service__WEBPACK_IMPORTED_MODULE_12__["Service"].getDrilldownDateRange(params.ReportBy, params.FromDate, params.ToDate, firstRow.Date);
        excelData = {
          FromDate: _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__["default"].convertDateToString(moment__WEBPACK_IMPORTED_MODULE_13___default()(drillDownDate.fromDate)),
          ToDate: _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__["default"].convertDateToString(moment__WEBPACK_IMPORTED_MODULE_13___default()(drillDownDate.toDate)),
          BaseCurrency: gridData.AdditionalInfo,
          CurrencyName: firstRow.CurrencyName,
          CurrencyId: firstRow.CurrencyId,
          ReportBy: params.ReportBy
        };
      }

      var title = _lib_service__WEBPACK_IMPORTED_MODULE_12__["Service"].getReportTitle({
        fromDate: excelData.FromDate,
        toDate: excelData.ToDate
      }, excelData.BaseCurrency ? excelData.BaseCurrency : excelData.CurrencyName, level === _constants_report__WEBPACK_IMPORTED_MODULE_9__["ReportLevel"].MAIN ? excelData.CurrencyId === 0 : false);
      var excel = new _lib_reportExcel__WEBPACK_IMPORTED_MODULE_11__["default"](gridData, title, level, isAllowedCustomerComm, excelData.ReportBy);
      excel.export(function () {
        _this2.props.toggleLoader(false);
      });
    }
  }, {
    key: "_getParams",
    value: function _getParams() {
      var _this3 = this;

      var param = {};
      var _this$props$dateRange = this.props.dateRange,
          fromDate = _this$props$dateRange.fromDate,
          toDate = _this$props$dateRange.toDate;
      var baseCurrency = _constants_currency__WEBPACK_IMPORTED_MODULE_10__["BaseCurrency"].find(function (x) {
        return x.value === _this3.props.selectedCurrency.value;
      });
      param = {
        CurrencyId: this.props.selectedCurrency.value,
        BaseCurrency: baseCurrency ? baseCurrency.text : "",
        CurrencyName: baseCurrency ? baseCurrency.text : this.props.selectedCurrency.label,
        FromDate: _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__["default"].convertDateToString(fromDate),
        ToDate: _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__["default"].convertDateToString(toDate),
        ReportBy: this.props.selectedReportBy,
        ExcludeTestData: this.props.isExcludeTest,
        Level: 0
      };
      return {
        data: param
      };
    }
  }, {
    key: "_renderDateRange",
    value: function _renderDateRange() {
      var dateRange = this.props.dateRange;
      var dateConstraint = _jsroot_lib_AppData__WEBPACK_IMPORTED_MODULE_8__["default"].dateConstraint;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_date_range_index__WEBPACK_IMPORTED_MODULE_5__["DateRange"], {
        startDate: dateRange.fromDate,
        endDate: dateRange.toDate,
        minDate: dateConstraint.minDate,
        maxDate: dateConstraint.maxDate,
        today: dateConstraint.toDay,
        limitedMonthRange: RANGE_MONTH_CONSTRAINT,
        onChange: this.applyDateRangeHandler
      });
    }
  }, {
    key: "_renderCurrencySelectList",
    value: function _renderCurrencySelectList() {
      var _this4 = this;

      var selectedCurrency = this.props.selectedCurrency;
      var currencyList = _jsroot_lib_AppData__WEBPACK_IMPORTED_MODULE_8__["default"].currencyList;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_4__["default"], {
        instanceId: "ddlCurrency",
        name: "form-field-name",
        value: selectedCurrency,
        options: currencyList,
        onChange: function onChange(item) {
          return _this4.props.setSelectedCurrency(item);
        }
      });
    }
  }, {
    key: "_renderReportByOption",
    value: function _renderReportByOption() {
      var _this5 = this;

      var _this$props = this.props,
          reportByOption = _this$props.reportByOption,
          selectedReportBy = _this$props.selectedReportBy;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('ReportBy')), reportByOption.map(function (option, i) {
        var key = 'ReportBy' + i;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          key: "Group".concat(key)
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "radio",
          value: option.value,
          checked: selectedReportBy === option.value,
          id: key,
          onChange: _this5.changeReportBy
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          htmlFor: key
        }, option.label));
      }));
    }
  }, {
    key: "_renderExcludeTestDataCheckBox",
    value: function _renderExcludeTestDataCheckBox() {
      var _this6 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "checkbox-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        className: "checkbox",
        checked: this.props.isExcludeTest,
        id: "ExcludeTest",
        onChange: function onChange() {
          return _this6.props.changeIsExcludeTest(!_this6.props.isExcludeTest);
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        style: {
          marginLeft: "0px"
        },
        htmlFor: "ExcludeTest"
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource("ExcludeTestData")));
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "page-filter"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-sm-7 col-md-4 col-xl-3"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('Date')), this._renderDateRange())), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-sm-4 col-md-2 col-xl-2"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('Currency')), this._renderCurrencySelectList())), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-sm-4 col-md-2 col-xl-2"
      }, this._renderReportByOption()), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-sm-3 col-md-2 col-xl-2"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, this._renderExcludeTestDataCheckBox())), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-sm-3 col-md-2 col-xl-2"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group button-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-submit",
        onClick: this.submit
      }, _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('Submit'))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "caret-block"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "icon-excel right",
        onClick: this.exportExcel,
        title: _lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('ExportToExcel')
      })));
    }
  }]);

  return FormFilter;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

function mapDispatchToProps(dispatch) {
  return Object(redux__WEBPACK_IMPORTED_MODULE_3__["bindActionCreators"])(_actions_index_js__WEBPACK_IMPORTED_MODULE_2__["ActionCreators"], dispatch);
}

;

function mapStateToProps(state) {
  var licenseeId = state.licenseeId,
      rest = _objectWithoutProperties(state, ["licenseeId"]);

  return Object.assign({}, rest);
}

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(FormFilter));

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/components/index.jsx":
/*!************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/components/index.jsx ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _AppContainer_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AppContainer.jsx */ "./www/js/source/reactpages/pages/exchangewl/components/AppContainer.jsx");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _reducers_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reducers/index.js */ "./www/js/source/reactpages/pages/exchangewl/reducers/index.js");
/* harmony import */ var _lib_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../lib/store */ "./www/js/source/reactpages/lib/store.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var defaultState = Object.assign({}, window.initialState);
var store = _lib_store__WEBPACK_IMPORTED_MODULE_5__["default"].createStore(_reducers_index_js__WEBPACK_IMPORTED_MODULE_4__["default"], defaultState);

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_redux__WEBPACK_IMPORTED_MODULE_3__["Provider"], {
        store: store
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_AppContainer_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], null));
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(App, null), document.getElementById('app-container'));

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/lib/reportExcel.js":
/*!**********************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/lib/reportExcel.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ReportExcel; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_excel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/excel */ "./www/js/source/reactpages/lib/excel.js");
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../constants/excelStyle */ "./www/js/source/reactpages/constants/excelStyle.js");
/* harmony import */ var _lib_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/service */ "./www/js/source/reactpages/pages/exchangewl/lib/service.js");
/* harmony import */ var _constants_report__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../constants/report */ "./www/js/source/reactpages/constants/report.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }







var TITLE_ROW_INDEX = 0;
var HEADER_ROW_INDEX = 1;
var DATA_ROW_INDEX = 3;
var MAX_COLUMN = 15;
var MAIN_SECTION = 'main';
var TOTAL_SECTION = 'total';
var SUMMARYTOTAL_SECTION = 'summary';
var HEADER_SECTION = 'header';

var ReportExcel =
/*#__PURE__*/
function () {
  function ReportExcel() {
    var gridData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var title = arguments.length > 1 ? arguments[1] : undefined;
    var level = arguments.length > 2 ? arguments[2] : undefined;
    var isAllowedCustomerComm = arguments.length > 3 ? arguments[3] : undefined;
    var reportBy = arguments.length > 4 ? arguments[4] : undefined;

    _classCallCheck(this, ReportExcel);

    this.worksheet = {};
    this.title = title;
    this.fileName = "ExchangeWinLoss";
    this.level = level;
    this.isAllowedCustomerComm = isAllowedCustomerComm;
    this.gridData = gridData;
    this.reportBy = reportBy;
    this.currentRowIndex = DATA_ROW_INDEX;
    this.totalColumn = MAX_COLUMN - (reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].CUSTOMER ? 1 : 2) - (isAllowedCustomerComm ? 0 : 2);
    this.configColumn = this._getConfigColumn(level, reportBy, isAllowedCustomerComm);
    this.colSpanConfig = this._getColSpanConfig(level);
    this.mergeConfig = [];
  }

  _createClass(ReportExcel, [{
    key: "export",
    value: function _export(onFinished) {
      var _this = this;

      if (!this.gridData.DataList || !this.gridData.DataList.length) {
        onFinished && onFinished();
        return;
      }

      _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].process(function () {
        _this._createHeader();

        _this._createSheetData();

        _this._createExcelConfig();

        _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].export(_this.worksheet, _this.fileName);
        onFinished && onFinished();
      });
    }
  }, {
    key: "_getColSpanConfig",
    value: function _getColSpanConfig(level) {
      var _ref;

      return _ref = {}, _defineProperty(_ref, TOTAL_SECTION, {
        colSpan: level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].CUSTOMER ? 3 : 2,
        text: _lib_service__WEBPACK_IMPORTED_MODULE_4__["TotalText"].total,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].rowspan
      }), _defineProperty(_ref, SUMMARYTOTAL_SECTION, {
        colSpan: level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].CUSTOMER ? 4 : 3,
        text: _lib_service__WEBPACK_IMPORTED_MODULE_4__["TotalText"].totalIn,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].rowspan
      }), _ref;
    }
  }, {
    key: "_getConfigColumn",
    value: function _getConfigColumn(level, reportBy, isAllowedCustomerComm) {
      var _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18;

      return [(_ref2 = {
        field: 'Index',
        type: 's'
      }, _defineProperty(_ref2, HEADER_SECTION, {
        title: 'index',
        isShow: true,
        rowSpan: 2,
        index_r: HEADER_ROW_INDEX
      }), _defineProperty(_ref2, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].center,
        width: 50
      }), _defineProperty(_ref2, TOTAL_SECTION, {
        isShow: false
      }), _defineProperty(_ref2, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref2), (_ref3 = {
        field: 'Date',
        type: 's'
      }, _defineProperty(_ref3, HEADER_SECTION, {
        title: reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportBy"].DAILY ? 'date' : 'month',
        isShow: level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].MAIN,
        rowSpan: 2
      }), _defineProperty(_ref3, MAIN_SECTION, {
        isShow: level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].MAIN,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].center,
        width: 150
      }), _defineProperty(_ref3, TOTAL_SECTION, {
        isShow: false
      }), _defineProperty(_ref3, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref3), (_ref4 = {
        field: 'ExternalId',
        type: 's'
      }, _defineProperty(_ref4, HEADER_SECTION, {
        title: 'externalId',
        isShow: level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].CUSTOMER,
        rowSpan: 2
      }), _defineProperty(_ref4, MAIN_SECTION, {
        isShow: level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].CUSTOMER,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].left,
        width: 150
      }), _defineProperty(_ref4, TOTAL_SECTION, {
        isShow: false
      }), _defineProperty(_ref4, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref4), (_ref5 = {
        field: 'SystemId',
        type: 's'
      }, _defineProperty(_ref5, HEADER_SECTION, {
        title: 'systemId',
        isShow: level !== _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].MAIN,
        rowSpan: 2
      }), _defineProperty(_ref5, MAIN_SECTION, {
        isShow: level !== _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].MAIN,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].left,
        width: 150
      }), _defineProperty(_ref5, TOTAL_SECTION, {
        isShow: false
      }), _defineProperty(_ref5, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref5), (_ref6 = {
        field: 'CurrencyName',
        type: 's'
      }, _defineProperty(_ref6, HEADER_SECTION, {
        title: 'currency',
        isShow: true,
        rowSpan: 2
      }), _defineProperty(_ref6, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].center,
        width: 120
      }), _defineProperty(_ref6, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].center
      }), _defineProperty(_ref6, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref6), (_ref7 = {
        field: 'Turnover',
        type: 'n'
      }, _defineProperty(_ref7, HEADER_SECTION, {
        title: 'turnover',
        isShow: true,
        rowSpan: 2
      }), _defineProperty(_ref7, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 150
      }), _defineProperty(_ref7, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_ref7, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _ref7), (_ref8 = {
        field: 'NetTurnover',
        type: 'n'
      }, _defineProperty(_ref8, HEADER_SECTION, {
        title: 'netTurnover',
        isShow: true,
        rowSpan: 2
      }), _defineProperty(_ref8, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 150
      }), _defineProperty(_ref8, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_ref8, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _ref8), (_ref9 = {
        field: 'TotalTransaction',
        type: 'n'
      }, _defineProperty(_ref9, HEADER_SECTION, {
        title: 'totalTransaction',
        isShow: true,
        rowSpan: 2
      }), _defineProperty(_ref9, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].number,
        width: 120
      }), _defineProperty(_ref9, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].number
      }), _defineProperty(_ref9, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].number
      }), _ref9), (_ref10 = {}, _defineProperty(_ref10, HEADER_SECTION, {
        title: isAllowedCustomerComm ? 'customer' : 'customerWL',
        isShow: true,
        rowSpan: isAllowedCustomerComm ? 1 : 2,
        colSpan: isAllowedCustomerComm ? 3 : 1
      }), _defineProperty(_ref10, MAIN_SECTION, {
        isShow: false
      }), _defineProperty(_ref10, TOTAL_SECTION, {
        isShow: false
      }), _defineProperty(_ref10, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref10), (_ref11 = {}, _defineProperty(_ref11, HEADER_SECTION, {
        title: 'licensee',
        isShow: true,
        colSpan: 4
      }), _defineProperty(_ref11, MAIN_SECTION, {
        isShow: false
      }), _defineProperty(_ref11, TOTAL_SECTION, {
        isShow: false
      }), _defineProperty(_ref11, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref11), (_ref12 = {
        field: 'CustomerWL',
        type: 'n'
      }, _defineProperty(_ref12, HEADER_SECTION, {
        title: 'customerWL',
        isShow: isAllowedCustomerComm,
        index_c: level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].CUSTOMER ? 7 : 6,
        index_r: HEADER_ROW_INDEX + 1
      }), _defineProperty(_ref12, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 150
      }), _defineProperty(_ref12, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_ref12, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _ref12), (_ref13 = {
        field: 'CustomerComm',
        type: 'n'
      }, _defineProperty(_ref13, HEADER_SECTION, {
        title: 'customerComm',
        isShow: isAllowedCustomerComm
      }), _defineProperty(_ref13, MAIN_SECTION, {
        isShow: isAllowedCustomerComm,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 150
      }), _defineProperty(_ref13, TOTAL_SECTION, {
        isShow: isAllowedCustomerComm,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_ref13, SUMMARYTOTAL_SECTION, {
        isShow: isAllowedCustomerComm,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _ref13), (_ref14 = {
        field: 'CustomerWLTotal',
        type: 'n'
      }, _defineProperty(_ref14, HEADER_SECTION, {
        title: 'total',
        isShow: isAllowedCustomerComm
      }), _defineProperty(_ref14, MAIN_SECTION, {
        isShow: isAllowedCustomerComm,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 150
      }), _defineProperty(_ref14, TOTAL_SECTION, {
        isShow: isAllowedCustomerComm,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_ref14, SUMMARYTOTAL_SECTION, {
        isShow: isAllowedCustomerComm,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _ref14), (_ref15 = {
        field: 'LicenseeWL',
        type: 'n'
      }, _defineProperty(_ref15, HEADER_SECTION, {
        title: 'licenseeWL',
        isShow: true,
        index_c: (level === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportLevel"].CUSTOMER ? 8 : 7) + (isAllowedCustomerComm ? 2 : 0),
        index_r: HEADER_ROW_INDEX + 1
      }), _defineProperty(_ref15, MAIN_SECTION, {
        isShow: true,
        hasNegativeStyle: true,
        style: {
          positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
          negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].negativeDecimal
        },
        width: 150
      }), _defineProperty(_ref15, TOTAL_SECTION, {
        isShow: true,
        hasNegativeStyle: true,
        style: {
          positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
          negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].negativeDecimal
        }
      }), _defineProperty(_ref15, SUMMARYTOTAL_SECTION, {
        isShow: true,
        hasNegativeStyle: true,
        style: {
          positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
          negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].negativeDecimal
        }
      }), _ref15), (_ref16 = {
        field: 'AmountDueTo',
        type: 'n'
      }, _defineProperty(_ref16, HEADER_SECTION, {
        title: 'amountDueTo',
        isShow: true
      }), _defineProperty(_ref16, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 150
      }), _defineProperty(_ref16, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_ref16, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _ref16), (_ref17 = {
        field: 'LicenseeComm',
        type: 'n'
      }, _defineProperty(_ref17, HEADER_SECTION, {
        title: 'licenseeComm',
        isShow: true
      }), _defineProperty(_ref17, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 150
      }), _defineProperty(_ref17, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_ref17, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _ref17), (_ref18 = {
        field: 'LicenseeWLTotal',
        type: 'n'
      }, _defineProperty(_ref18, HEADER_SECTION, {
        title: 'total',
        isShow: true
      }), _defineProperty(_ref18, MAIN_SECTION, {
        isShow: true,
        hasNegativeStyle: true,
        style: {
          positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
          negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].negativeDecimal
        },
        width: 150
      }), _defineProperty(_ref18, TOTAL_SECTION, {
        isShow: true,
        hasNegativeStyle: true,
        style: {
          positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
          negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].negativeDecimal
        }
      }), _defineProperty(_ref18, SUMMARYTOTAL_SECTION, {
        isShow: true,
        hasNegativeStyle: true,
        style: {
          positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
          negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].negativeDecimal
        }
      }), _ref18)];
    }
  }, {
    key: "_createTitle",
    value: function _createTitle(colSpan) {
      this.mergeConfig.push({
        s: {
          r: TITLE_ROW_INDEX,
          c: 0
        },
        e: {
          r: TITLE_ROW_INDEX,
          c: colSpan - 1
        }
      });
      var address = _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].getCellAddress({
        c: 0,
        r: TITLE_ROW_INDEX
      });
      this.worksheet[address] = {
        t: "s",
        v: this.title,
        s: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["titleCellStyle"]
      };
    }
  }, {
    key: "_createHeader",
    value: function _createHeader() {
      var nextColumnIndex = 0;
      var nextRowIndex = 0;
      var totalCol = this.configColumn.length;

      for (var i = 0; i < totalCol; i++) {
        var column = this.configColumn[i].header;

        if (column.isShow) {
          nextColumnIndex = column.index_c ? column.index_c : nextColumnIndex;
          nextRowIndex = column.index_r ? column.index_r : nextRowIndex;
          var address = _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].getCellAddress({
            c: nextColumnIndex,
            r: nextRowIndex
          });
          var header = _lib_service__WEBPACK_IMPORTED_MODULE_4__["HeaderText"][column.title];
          this.worksheet[address] = {
            t: "s",
            v: header,
            s: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["headerCellStyle"]
          };

          if (column.colSpan > 1 || column.rowSpan > 1) {
            this.mergeConfig.push({
              s: {
                r: nextRowIndex,
                c: nextColumnIndex
              },
              e: {
                r: nextRowIndex + (column.rowSpan || 1) - 1,
                c: nextColumnIndex + (column.colSpan || 1) - 1
              }
            });
          }

          nextColumnIndex += column.colSpan || 1;
        }
      }

      this._createTitle(nextColumnIndex);
    }
  }, {
    key: "_createSheetData",
    value: function _createSheetData() {
      this._createMainData();

      this._createTotalData();

      this._createSummaryData();
    }
  }, {
    key: "_createMainData",
    value: function _createMainData() {
      var totalData = this.gridData.DataList.length;

      for (var i = 0; i < totalData; i++) {
        var data = this.gridData.DataList[i];
        data.Date = moment__WEBPACK_IMPORTED_MODULE_0___default()(data.Date).format(this.reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportBy"].DAILY ? "MM/DD/YYYY" : "MM/YYYY");
        data.Index = i + 1;

        this._createRowBySection(MAIN_SECTION, 0, this.currentRowIndex, data);

        ++this.currentRowIndex;
      }
    }
  }, {
    key: "_createTotalData",
    value: function _createTotalData() {
      var totalData = this.gridData.TotalDataList.length;
      var totalColSpanConfig = this.colSpanConfig[TOTAL_SECTION];

      this._createMergeTotalDataColumn(this.currentRowIndex, totalData, 0, totalColSpanConfig.colSpan, totalColSpanConfig.text, totalColSpanConfig.style);

      for (var i = 0; i < totalData; i++) {
        var data = this.gridData.TotalDataList[i];

        this._createRowBySection(TOTAL_SECTION, totalColSpanConfig.colSpan, this.currentRowIndex, data);

        ++this.currentRowIndex;
      }
    }
  }, {
    key: "_createSummaryData",
    value: function _createSummaryData() {
      var summaryColSpanConfig = this.colSpanConfig[SUMMARYTOTAL_SECTION];
      var keys = Object.keys(this.gridData.SummaryTotal);
      var length = keys.length;

      for (var i = length - 1; i >= 0; i--) {
        var key = keys[i];
        var data = this.gridData.SummaryTotal[key];

        this._createMergeTotalDataColumn(this.currentRowIndex, 1, 0, summaryColSpanConfig.colSpan, summaryColSpanConfig.text + ' ' + key, summaryColSpanConfig.style);

        this._createRowBySection(SUMMARYTOTAL_SECTION, summaryColSpanConfig.colSpan, this.currentRowIndex, data);

        ++this.currentRowIndex;
      }
    }
  }, {
    key: "_createMergeTotalDataColumn",
    value: function _createMergeTotalDataColumn(startRowIndex, rowSpan, startColIndex, colSpan, text, style) {
      var address = _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].getCellAddress({
        c: startColIndex,
        r: startRowIndex
      });
      this.worksheet[address] = {
        t: 's',
        v: text,
        s: style
      };
      this.mergeConfig.push({
        s: {
          r: startRowIndex,
          c: startColIndex
        },
        e: {
          r: startRowIndex + rowSpan - 1,
          c: startColIndex + colSpan - 1
        }
      });
    }
  }, {
    key: "_createRowBySection",
    value: function _createRowBySection(section, startColIndex, startRowIndex, data) {
      var nextColumnIndex = startColIndex;
      var totalCol = this.configColumn.length;

      for (var i = 0; i < totalCol; i++) {
        var column = this.configColumn[i];
        var sectionColumn = column[section];

        if (sectionColumn.isShow) {
          nextColumnIndex = sectionColumn.index_c ? sectionColumn.index_c : nextColumnIndex;
          var address = _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].getCellAddress({
            c: nextColumnIndex,
            r: startRowIndex
          });
          var value = data[column.field];
          this.worksheet[address] = {
            t: column.type,
            v: value,
            s: sectionColumn.hasNegativeStyle ? value >= 0 ? sectionColumn.style.positive : sectionColumn.style.negative : sectionColumn.style
          };
          ++nextColumnIndex;
        }
      }
    }
  }, {
    key: "_createExcelConfig",
    value: function _createExcelConfig() {
      var columnModels = [];
      var totalCol = this.configColumn.length;

      for (var i = 0; i < totalCol; i++) {
        var column = this.configColumn[i][MAIN_SECTION];

        if (column.isShow) {
          columnModels.push({
            wpx: column.width
          });
        }
      }

      var cellStart = _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].getCellAddress({
        r: 0,
        c: 0
      });
      var cellEnd = _lib_excel__WEBPACK_IMPORTED_MODULE_1__["default"].getCellAddress({
        r: this.currentRowIndex,
        c: this.totalColumn
      });
      this.worksheet["!merges"] = this.mergeConfig;
      this.worksheet["!ref"] = "".concat(cellStart, ":").concat(cellEnd);
      this.worksheet['!cols'] = columnModels;
    }
  }]);

  return ReportExcel;
}();



/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/lib/service.js":
/*!******************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/lib/service.js ***!
  \******************************************************************/
/*! exports provided: HeaderText, TotalText, BreadcrumbText, Service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderText", function() { return HeaderText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TotalText", function() { return TotalText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreadcrumbText", function() { return BreadcrumbText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Service", function() { return Service; });
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var _lib_site__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/site */ "./www/js/source/reactpages/lib/site.js");
/* harmony import */ var _lib_report__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/report */ "./www/js/source/reactpages/lib/report.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var HeaderText = {
  index: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('#'),
  date: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Date'),
  month: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Month'),
  externalId: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('ExternalId'),
  systemId: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('SystemId'),
  currency: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Currency'),
  turnover: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Turnover'),
  netTurnover: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('NetTurnover'),
  totalTransaction: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('TotalTransaction'),
  customer: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Customer'),
  customerWL: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('CustomerW_L'),
  customerComm: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('CustomerComm'),
  total: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Total'),
  licensee: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Licensee'),
  licenseeWL: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('LicenseeW_L'),
  amountDueTo: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('AmountDueTo'),
  licenseeComm: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('LicenseeComm')
};
var TotalText = {
  total: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Total'),
  totalIn: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Totalin')
};
var BreadcrumbText = {
  main: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Main'),
  licensee: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Licensee'),
  customer: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Customer')
};
var Service =
/*#__PURE__*/
function () {
  function Service() {
    _classCallCheck(this, Service);
  }

  _createClass(Service, null, [{
    key: "getReportTitle",
    value: function getReportTitle(dateRange, selectedCurrency, allCurrencies) {
      var fromDate = _lib_site__WEBPACK_IMPORTED_MODULE_1__["default"].convertDateToString(dateRange.fromDate);
      var toDate = _lib_site__WEBPACK_IMPORTED_MODULE_1__["default"].convertDateToString(dateRange.toDate);
      var viewInByCurrency = allCurrencies ? _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('AllCurrencies') : "".concat(_lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Viewin').replace('{0}', selectedCurrency));
      return "".concat(_lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('ExchangeWinLoss'), ", ").concat(fromDate, " - ").concat(toDate, " - ").concat(viewInByCurrency);
    }
  }, {
    key: "showErrorMsg",
    value: function showErrorMsg() {
      alert(_lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('ErrorProcessingMsg'));
    }
  }, {
    key: "getDrilldownDateRange",
    value: function getDrilldownDateRange(reportBy, fromDate, toDate, drilldownDate) {
      return _lib_report__WEBPACK_IMPORTED_MODULE_2__["default"].getDrilldownDateRange(reportBy, fromDate, toDate, drilldownDate);
    }
  }]);

  return Service;
}();

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/reducers/dataHandlerReducer.js":
/*!**********************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/reducers/dataHandlerReducer.js ***!
  \**********************************************************************************/
/*! exports provided: gridData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gridData", function() { return gridData; });
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
/* harmony import */ var _actions_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/types.js */ "./www/js/source/reactpages/pages/exchangewl/actions/types.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var gridData = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["SET_GRID_DATA"], function (state, action) {
  return action.data;
}));

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/reducers/filterHandlerReducer.js":
/*!************************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/reducers/filterHandlerReducer.js ***!
  \************************************************************************************/
/*! exports provided: reportByOption, selectedReportBy, params, licenseeId, isAllowedCustomerComm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reportByOption", function() { return reportByOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectedReportBy", function() { return selectedReportBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "params", function() { return params; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "licenseeId", function() { return licenseeId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAllowedCustomerComm", function() { return isAllowedCustomerComm; });
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
/* harmony import */ var _actions_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/types.js */ "./www/js/source/reactpages/pages/exchangewl/actions/types.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var reportByOption = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["GET_REPORTBY"], function (state, action) {
  return action.data;
}));
var selectedReportBy = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["SET_REPORTBY"], function (state, action) {
  return action.data;
}));
var params = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["SET_PARAM"], function (state, action) {
  return action.data;
}));
var licenseeId = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["GET_LICENSEE"], function (state, action) {
  return action.data;
}));
var isAllowedCustomerComm = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["GET_ISALLOWED_CUSTOMERCOMM"], function (state, action) {
  return action.data;
}));

/***/ }),

/***/ "./www/js/source/reactpages/pages/exchangewl/reducers/index.js":
/*!*********************************************************************!*\
  !*** ./www/js/source/reactpages/pages/exchangewl/reducers/index.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _dataHandlerReducer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataHandlerReducer.js */ "./www/js/source/reactpages/pages/exchangewl/reducers/dataHandlerReducer.js");
/* harmony import */ var _filterHandlerReducer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filterHandlerReducer.js */ "./www/js/source/reactpages/pages/exchangewl/reducers/filterHandlerReducer.js");
/* harmony import */ var _reducers_currencyReducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../reducers/currencyReducer */ "./www/js/source/reactpages/reducers/currencyReducer.js");
/* harmony import */ var _reducers_loaderReducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../reducers/loaderReducer */ "./www/js/source/reactpages/reducers/loaderReducer.js");
/* harmony import */ var _reducers_excludeTestReducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../reducers/excludeTestReducer */ "./www/js/source/reactpages/reducers/excludeTestReducer.js");
/* harmony import */ var _reducers_dateRangeReducer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../reducers/dateRangeReducer */ "./www/js/source/reactpages/reducers/dateRangeReducer.js");







/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])(Object.assign(_dataHandlerReducer_js__WEBPACK_IMPORTED_MODULE_1__, _filterHandlerReducer_js__WEBPACK_IMPORTED_MODULE_2__, _reducers_currencyReducer__WEBPACK_IMPORTED_MODULE_3__, _reducers_loaderReducer__WEBPACK_IMPORTED_MODULE_4__, _reducers_excludeTestReducer__WEBPACK_IMPORTED_MODULE_5__, _reducers_dateRangeReducer__WEBPACK_IMPORTED_MODULE_6__)));

/***/ }),

/***/ "./www/js/source/reactpages/reducers/currencyReducer.js":
/*!**************************************************************!*\
  !*** ./www/js/source/reactpages/reducers/currencyReducer.js ***!
  \**************************************************************/
/*! exports provided: selectedCurrency */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectedCurrency", function() { return selectedCurrency; });
/* harmony import */ var _actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/types */ "./www/js/source/reactpages/actions/types.js");
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var selectedCurrency = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, _defineProperty({}, _actions_types__WEBPACK_IMPORTED_MODULE_0__["SET_SELECTED_CURRENCY"], function (state, action) {
  return action.data;
}));

/***/ }),

/***/ "./www/js/source/reactpages/reducers/dateRangeReducer.js":
/*!***************************************************************!*\
  !*** ./www/js/source/reactpages/reducers/dateRangeReducer.js ***!
  \***************************************************************/
/*! exports provided: dateRange */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateRange", function() { return dateRange; });
/* harmony import */ var _actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/types */ "./www/js/source/reactpages/actions/types.js");
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var dateRange = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, _defineProperty({}, _actions_types__WEBPACK_IMPORTED_MODULE_0__["SET_DATE_RANGE"], function (state, action) {
  return action.data;
}));

/***/ }),

/***/ "./www/js/source/reactpages/reducers/excludeTestReducer.js":
/*!*****************************************************************!*\
  !*** ./www/js/source/reactpages/reducers/excludeTestReducer.js ***!
  \*****************************************************************/
/*! exports provided: isExcludeTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isExcludeTest", function() { return isExcludeTest; });
/* harmony import */ var _actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/types */ "./www/js/source/reactpages/actions/types.js");
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var isExcludeTest = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, _defineProperty({}, _actions_types__WEBPACK_IMPORTED_MODULE_0__["CHANGE_IS_EXCLUDE_TEST"], function (state, action) {
  return action.data;
}));

/***/ }),

/***/ "./www/js/source/reactpages/reducers/loaderReducer.js":
/*!************************************************************!*\
  !*** ./www/js/source/reactpages/reducers/loaderReducer.js ***!
  \************************************************************/
/*! exports provided: isLoading */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLoading", function() { return isLoading; });
/* harmony import */ var _actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/types */ "./www/js/source/reactpages/actions/types.js");
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var isLoading = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, _defineProperty({}, _actions_types__WEBPACK_IMPORTED_MODULE_0__["TOGGLE_LOADER"], function (state, action) {
  return action.data;
}));

/***/ })

/******/ });
//# sourceMappingURL=exchangewl.chunk.js.map