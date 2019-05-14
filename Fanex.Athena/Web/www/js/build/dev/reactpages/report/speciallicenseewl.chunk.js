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
/******/ 		"www/js/build/dev/reactpages/report/speciallicenseewl": 0
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
/******/ 	deferredModules.push(["./www/js/source/reactpages/pages/speciallicenseewl/components/index.jsx","common"]);
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

/***/ "./www/js/source/reactpages/actions/productAction.js":
/*!***********************************************************!*\
  !*** ./www/js/source/reactpages/actions/productAction.js ***!
  \***********************************************************/
/*! exports provided: setSelectedProduct */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSelectedProduct", function() { return setSelectedProduct; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./www/js/source/reactpages/actions/types.js");

var setSelectedProduct = function setSelectedProduct(product) {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["SET_SELECTED_PRODUCT"],
    data: product
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

/***/ "./www/js/source/reactpages/components/month-picker/Day.jsx":
/*!******************************************************************!*\
  !*** ./www/js/source/reactpages/components/month-picker/Day.jsx ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Overlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Overlay */ "./www/js/source/reactpages/components/Overlay.jsx");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
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





var Day =
/*#__PURE__*/
function (_Component) {
  _inherits(Day, _Component);

  function Day(props, context) {
    var _this;

    _classCallCheck(this, Day);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Day).call(this, props, context));
    _this.state = {
      showDateDrop: false
    };
    return _this;
  }

  _createClass(Day, [{
    key: "_renderOption",
    value: function _renderOption(min, max, value) {
      var _this2 = this;

      var options = [];

      var _loop = function _loop(i) {
        options.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          key: i,
          onClick: function onClick() {
            return _this2._onChange(i);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "javascript:;"
        }, i)));
      };

      for (var i = min; i <= max; i++) {
        _loop(i);
      }

      return options;
    }
  }, {
    key: "_onChange",
    value: function _onChange(value) {
      this.props.onChange(parseInt(value, 10));
      this.setState({
        showDateDrop: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var value = this.props.value;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "date"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, this.props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "date-content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "date-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "date-picked",
        onClick: function onClick() {
          return _this3.setState({
            showDateDrop: true
          });
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "date-label"
      }, value), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "arrow-icon down-arrow"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Overlay__WEBPACK_IMPORTED_MODULE_1__["default"], {
        isOpening: this.state.showDateDrop,
        onClose: function onClose() {
          return _this3.setState({
            showDateDrop: false
          });
        }
      }, this.state.showDateDrop && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "date-selection-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, this._renderOption(this.props.min, this.props.max, value)))))));
    }
  }]);

  return Day;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(Day, "propTypes", {
  label: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number.isRequired,
  min: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number.isRequired,
  max: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number.isRequired,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func
});

_defineProperty(Day, "defaultProps", {
  onChange: function onChange() {}
});

/* harmony default export */ __webpack_exports__["default"] = (Day);

/***/ }),

/***/ "./www/js/source/reactpages/components/month-picker/Month.jsx":
/*!********************************************************************!*\
  !*** ./www/js/source/reactpages/components/month-picker/Month.jsx ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Overlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Overlay */ "./www/js/source/reactpages/components/Overlay.jsx");
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
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






var Month =
/*#__PURE__*/
function (_Component) {
  _inherits(Month, _Component);

  function Month(props, context) {
    var _this;

    _classCallCheck(this, Month);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Month).call(this, props, context));
    var shortMonths = _lib_langHelper__WEBPACK_IMPORTED_MODULE_2__["default"].getResources(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    var fullMonths = _lib_langHelper__WEBPACK_IMPORTED_MODULE_2__["default"].getResources(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
    _this.shortMonths = shortMonths;
    _this.fullMonths = fullMonths;
    _this.state = {
      expandYear: props.value.year,
      showMonthDrop: false
    };
    return _this;
  }

  _createClass(Month, [{
    key: "_onChange",
    value: function _onChange(value) {
      this.props.onChange(value);
      this.setState({
        showMonthDrop: false
      });
    }
  }, {
    key: "_formatString",
    value: function _formatString(month, year) {
      return this.shortMonths[month] + ' ' + year;
    }
  }, {
    key: "_renderOption",
    value: function _renderOption(min, max, value) {
      var _this2 = this;

      var options = [];

      var _loop = function _loop(i) {
        if (i === _this2.state.expandYear) {
          options.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
            key: i,
            className: "year",
            style: {
              fontWeight: 'bold'
            }
          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            href: "javascript:;"
          }, i)));
          var minMonth = i === min.year ? min.month : 0;
          var maxMonth = i === max.year ? max.month : 11;

          var _loop2 = function _loop2(j) {
            var isSelected = i === value.year && j === value.month;
            var valueItem = {
              year: i,
              month: j
            };
            options.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
              key: "".concat(j).concat(i),
              className: "month-option",
              onClick: function onClick() {
                return _this2._onChange(valueItem);
              }
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
              href: "javascript:;",
              className: "".concat(isSelected ? 'selected' : '')
            }, _this2.fullMonths[j])));
          };

          for (var j = minMonth; j <= maxMonth; j++) {
            _loop2(j);
          }
        } else {
          options.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
            key: i,
            className: "year",
            onClick: function onClick() {
              return _this2.setState({
                expandYear: i
              });
            }
          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
            href: "javascript:;"
          }, i)));
        }
      };

      for (var i = min.year; i <= max.year; i++) {
        _loop(i);
      }

      return options;
    }
  }, {
    key: "_getNextMonth",
    value: function _getNextMonth() {
      var month = this.props.value.month + 1;
      var year = this.props.value.year;

      if (month > 11) {
        month = 0;
        year += 1;
      }

      return {
        year: year,
        month: month
      };
    }
  }, {
    key: "_getPrevMonth",
    value: function _getPrevMonth() {
      var month = this.props.value.month - 1;
      var year = this.props.value.year;

      if (month < 0) {
        month = 11;
        year -= 1;
      }

      return {
        year: year,
        month: month
      };
    }
  }, {
    key: "_checkValidMonth",
    value: function _checkValidMonth(month, year) {
      var _this$props = this.props,
          min = _this$props.min,
          max = _this$props.max;
      return year > min.year && year < max.year || year === min.year && month >= min.month || year === max.year && month <= max.month;
    }
  }, {
    key: "_goToMonth",
    value: function _goToMonth(e, value) {
      e.preventDefault();

      if (value.year !== this.state.expandYear) {
        this.setState({
          expandYear: value.year
        });
      }

      this.props.onChange(value);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var nexMonth = this._getNextMonth();

      var preMonth = this._getPrevMonth();

      var validNexMonth = this._checkValidMonth(nexMonth.month, nexMonth.year);

      var validPreMonth = this._checkValidMonth(preMonth.month, preMonth.year);

      var value = this.props.value;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "month"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, this.props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "month-content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "month-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "month-picked"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "prev",
        onClick: function onClick(e) {
          return validPreMonth && _this3._goToMonth(e, preMonth);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "arrow-icon left-arrow ".concat(validPreMonth ? '' : 'disable')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "month-label",
        onClick: function onClick() {
          return _this3.setState({
            showMonthDrop: true
          });
        }
      }, this._formatString(value.month, value.year)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "next",
        onClick: function onClick(e) {
          return validNexMonth && _this3._goToMonth(e, nexMonth);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "arrow-icon right-arrow ".concat(validNexMonth ? '' : 'disable')
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Overlay__WEBPACK_IMPORTED_MODULE_1__["default"], {
        isOpening: this.state.showMonthDrop,
        onClose: function onClose() {
          return _this3.setState({
            showMonthDrop: false
          });
        }
      }, this.state.showMonthDrop && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "month-selection-container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "month-selection"
      }, this._renderOption(this.props.min, this.props.max, value)))))));
    }
  }]);

  return Month;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(Month, "propTypes", {
  label: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.object.isRequired,
  min: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.object.isRequired,
  max: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.object.isRequired,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.func
});

_defineProperty(Month, "defaultProps", {
  label: 'View data in month',
  onChange: function onChange() {}
});

/* harmony default export */ __webpack_exports__["default"] = (Month);

/***/ }),

/***/ "./www/js/source/reactpages/components/month-picker/MonthPicker.jsx":
/*!**************************************************************************!*\
  !*** ./www/js/source/reactpages/components/month-picker/MonthPicker.jsx ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Month__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Month */ "./www/js/source/reactpages/components/month-picker/Month.jsx");
/* harmony import */ var _Day__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Day */ "./www/js/source/reactpages/components/month-picker/Day.jsx");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var MonthPicker =
/*#__PURE__*/
function (_Component) {
  _inherits(MonthPicker, _Component);

  function MonthPicker(props) {
    var _this;

    _classCallCheck(this, MonthPicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MonthPicker).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_onMonthChange", function (value) {
      var minDate = value.year === _this.min.year && value.month === _this.min.month ? _this.min.date : 1;
      var maxDate = value.year === _this.max.year && value.month === _this.max.month ? _this.max.date : moment__WEBPACK_IMPORTED_MODULE_3___default()({
        year: value.year,
        month: value.month
      }).daysInMonth();

      _this.setState({
        month: value,
        minDate: minDate,
        maxDate: maxDate,
        from: minDate,
        to: maxDate
      });

      _this.props.onChange({
        fromDate: _this._formatDate(minDate, value.month, value.year),
        toDate: _this._formatDate(maxDate, value.month, value.year)
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onFromDateChange", function (value) {
      _this.setState({
        from: value
      });

      _this.props.onChange({
        fromDate: _this._formatDate(value, _this.state.month.month, _this.state.month.year),
        toDate: _this._formatDate(_this.state.to, _this.state.month.month, _this.state.month.year)
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onToDateChange", function (value) {
      _this.setState({
        to: value
      });

      _this.props.onChange({
        fromDate: _this._formatDate(_this.state.from, _this.state.month.month, _this.state.month.year),
        toDate: _this._formatDate(value, _this.state.month.month, _this.state.month.year)
      });
    });

    var format = 'MM/DD/YYYY';

    var _minDate = moment__WEBPACK_IMPORTED_MODULE_3___default()(props.minDate, format);

    var _maxDate = moment__WEBPACK_IMPORTED_MODULE_3___default()(props.maxDate, format);

    var min = {
      year: _minDate.year(),
      month: _minDate.month(),
      date: _minDate.date()
    };
    var max = {
      year: _maxDate.year(),
      month: _maxDate.month(),
      date: _maxDate.date()
    };
    _this.min = min;
    _this.max = max;
    var fromDate = moment__WEBPACK_IMPORTED_MODULE_3___default()(props.fromDate, format);
    var toDate = moment__WEBPACK_IMPORTED_MODULE_3___default()(props.toDate, format);
    var currentMonth = {
      year: fromDate.year(),
      month: fromDate.month()
    };
    _this.state = {
      month: currentMonth,
      from: fromDate.date(),
      to: toDate.date()
    };
    return _this;
  }

  _createClass(MonthPicker, [{
    key: "_formatDate",
    value: function _formatDate(date, month, year) {
      return "".concat(month < 9 ? '0' + (month + 1) : month + 1, "/").concat(date < 10 ? '0' + date : date, "/").concat(year);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          month = _this$state.month,
          from = _this$state.from,
          to = _this$state.to;
      var daysInMonth = moment__WEBPACK_IMPORTED_MODULE_3___default()({
        year: month.year,
        month: month.month
      }).daysInMonth();
      var startDate = month.year === this.min.year && month.month === this.min.month ? this.min.date : 1;
      var endDate = month.year === this.max.year && month.month === this.max.month ? this.max.date : daysInMonth;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "month-picker"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Month__WEBPACK_IMPORTED_MODULE_1__["default"], _extends({
        min: this.min,
        max: this.max,
        value: month
      }, this.props.monthOption, {
        onChange: this._onMonthChange
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Day__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
        min: startDate,
        max: endDate > to ? to : endDate,
        value: from
      }, this.props.fromDateOption, {
        onChange: this._onFromDateChange
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Day__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
        min: startDate < from ? from : startDate,
        max: endDate,
        value: to
      }, this.props.toDateOption, {
        onChange: this._onToDateChange
      })));
    }
  }]);

  return MonthPicker;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(MonthPicker, "propTypes", {
  monthOption: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.object.isRequired,
  fromDateOption: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.object.isRequired,
  toDateOption: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.object.isRequired,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.func,
  minDate: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.string.isRequired,
  maxDate: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.string.isRequired,
  fromDate: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.string.isRequired,
  toDate: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.string.isRequired
});

_defineProperty(MonthPicker, "defaultProps", {
  label: 'View data in month',
  onChange: function onChange() {}
});

/* harmony default export */ __webpack_exports__["default"] = (MonthPicker);

/***/ }),

/***/ "./www/js/source/reactpages/components/month-picker/index.js":
/*!*******************************************************************!*\
  !*** ./www/js/source/reactpages/components/month-picker/index.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MonthPicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MonthPicker */ "./www/js/source/reactpages/components/month-picker/MonthPicker.jsx");

/* harmony default export */ __webpack_exports__["default"] = (_MonthPicker__WEBPACK_IMPORTED_MODULE_0__["default"]);

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

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/actions/filterHandlerAction.js":
/*!*****************************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/actions/filterHandlerAction.js ***!
  \*****************************************************************************************/
/*! exports provided: setSelectedReportBy, setDateRange, setParams, setReportTitle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSelectedReportBy", function() { return setSelectedReportBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDateRange", function() { return setDateRange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setParams", function() { return setParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setReportTitle", function() { return setReportTitle; });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./www/js/source/reactpages/pages/speciallicenseewl/actions/types.js");

var setSelectedReportBy = function setSelectedReportBy(value) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["SET_REPORTBY"],
    data: value
  };
};
var setDateRange = function setDateRange(dateRange) {
  var range = {
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate
  };
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["SET_DATE_RANGE"],
    data: range
  };
};
var setParams = function setParams(params) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["SET_PARAMS"],
    data: params
  };
};
var setReportTitle = function setReportTitle(title) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["SET_REPORT_TITLE"],
    data: title
  };
};

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/actions/index.js":
/*!***************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/actions/index.js ***!
  \***************************************************************************/
/*! exports provided: ActionCreators */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionCreators", function() { return ActionCreators; });
/* harmony import */ var _filterHandlerAction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filterHandlerAction.js */ "./www/js/source/reactpages/pages/speciallicenseewl/actions/filterHandlerAction.js");
/* harmony import */ var _actions_productAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/productAction */ "./www/js/source/reactpages/actions/productAction.js");
/* harmony import */ var _actions_currencyAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../actions/currencyAction */ "./www/js/source/reactpages/actions/currencyAction.js");
/* harmony import */ var _actions_loaderAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../actions/loaderAction */ "./www/js/source/reactpages/actions/loaderAction.js");




var ActionCreators = Object.assign({}, _filterHandlerAction_js__WEBPACK_IMPORTED_MODULE_0__, _actions_productAction__WEBPACK_IMPORTED_MODULE_1__, _actions_currencyAction__WEBPACK_IMPORTED_MODULE_2__, _actions_loaderAction__WEBPACK_IMPORTED_MODULE_3__);

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/actions/types.js":
/*!***************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/actions/types.js ***!
  \***************************************************************************/
/*! exports provided: SET_GRID_DATA, GET_REPORTBY, SET_REPORTBY, SET_DATE_RANGE, GET_DATE_CONSTRAINT, GET_XSRF_TOKEN, SET_PARAMS, SET_REPORT_TITLE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_GRID_DATA", function() { return SET_GRID_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_REPORTBY", function() { return GET_REPORTBY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_REPORTBY", function() { return SET_REPORTBY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_DATE_RANGE", function() { return SET_DATE_RANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_DATE_CONSTRAINT", function() { return GET_DATE_CONSTRAINT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_XSRF_TOKEN", function() { return GET_XSRF_TOKEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_PARAMS", function() { return SET_PARAMS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_REPORT_TITLE", function() { return SET_REPORT_TITLE; });
var SET_GRID_DATA = 'SET_GRID_DATA';
var GET_REPORTBY = 'GET_REPORTBY';
var SET_REPORTBY = 'SET_REPORTBY';
var SET_DATE_RANGE = 'SET_DATE_RANGE';
var GET_DATE_CONSTRAINT = 'GET_DATE_CONSTRAINT';
var GET_XSRF_TOKEN = 'GET_XSRF_TOKEN';
var SET_PARAMS = 'SET_PARAMS';
var SET_REPORT_TITLE = 'SET_REPORT_TITLE';

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/components/AppContainer.jsx":
/*!**************************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/components/AppContainer.jsx ***!
  \**************************************************************************************/
/*! exports provided: AppContainer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppContainer", function() { return AppContainer; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _actions_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/index */ "./www/js/source/reactpages/pages/speciallicenseewl/actions/index.js");
/* harmony import */ var _FormFilter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FormFilter */ "./www/js/source/reactpages/pages/speciallicenseewl/components/FormFilter.jsx");
/* harmony import */ var _DataGrid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DataGrid */ "./www/js/source/reactpages/pages/speciallicenseewl/components/DataGrid.jsx");
/* harmony import */ var _components_Loader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../components/Loader */ "./www/js/source/reactpages/components/Loader.jsx");
/* harmony import */ var _layouts_AppLayout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../layouts/AppLayout */ "./www/js/source/reactpages/layouts/AppLayout.jsx");
/* harmony import */ var _components_ReportTitle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../components/ReportTitle */ "./www/js/source/reactpages/components/ReportTitle.jsx");
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_layouts_AppLayout__WEBPACK_IMPORTED_MODULE_7__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Loader__WEBPACK_IMPORTED_MODULE_6__["default"], {
        isLoading: this.props.isLoading
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_FormFilter__WEBPACK_IMPORTED_MODULE_4__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "result-content"
      }, this.props.reportTitle && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ReportTitle__WEBPACK_IMPORTED_MODULE_8__["default"], {
        content: this.props.reportTitle
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DataGrid__WEBPACK_IMPORTED_MODULE_5__["default"], null)));
    }
  }]);

  return AppContainer;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

function mapDispatchToProps(dispatch) {
  return Object(redux__WEBPACK_IMPORTED_MODULE_2__["bindActionCreators"])(_actions_index__WEBPACK_IMPORTED_MODULE_3__["ActionCreators"], dispatch);
}

function mapStateToProps(state) {
  return Object.assign({}, {
    isLoading: state.isLoading,
    reportTitle: state.reportTitle
  });
}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(AppContainer));

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/components/DataGrid.jsx":
/*!**********************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/components/DataGrid.jsx ***!
  \**********************************************************************************/
/*! exports provided: DataGrid, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataGrid", function() { return DataGrid; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/index.js */ "./www/js/source/reactpages/pages/speciallicenseewl/actions/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @9softstudio/react-grid */ "./node_modules/@9softstudio/react-grid/dist/index.js");
/* harmony import */ var _9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lib_numberFormat__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../lib/numberFormat */ "./www/js/source/reactpages/lib/numberFormat.js");
/* harmony import */ var _components_NoDataTitle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../components/NoDataTitle */ "./www/js/source/reactpages/components/NoDataTitle.jsx");
/* harmony import */ var _lib_report__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../lib/report */ "./www/js/source/reactpages/lib/report.js");
/* harmony import */ var _constants_report__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../constants/report */ "./www/js/source/reactpages/constants/report.js");
/* harmony import */ var _lib_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/service */ "./www/js/source/reactpages/pages/speciallicenseewl/lib/service.js");
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












var DataGrid =
/*#__PURE__*/
function (_Component) {
  _inherits(DataGrid, _Component);

  function DataGrid(props) {
    var _this;

    _classCallCheck(this, DataGrid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataGrid).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_sort", function (sortBy, sortOrder) {
      _this.props.toggleLoader(true);

      var param = Object.assign({}, _this.props.params, {
        SortOrder: sortOrder,
        SortBy: sortBy
      });
      var mainData = _this.state.gridData.Data;

      if (mainData && mainData.length > 1) {
        _lib_service__WEBPACK_IMPORTED_MODULE_10__["Service"].sort(mainData, param.SortBy, param.SortOrder);
        var sortedResult = Object.assign({}, _this.state.gridData, {
          Data: mainData
        });

        _this.setState({
          gridData: sortedResult
        });
      }

      _this.props.setParams(param);

      _this.props.toggleLoader(false);
    });

    _this.state = {
      expandTurnover: false,
      expandLicensee: false,
      gridData: {}
    };
    return _this;
  }

  _createClass(DataGrid, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.params.Timestamp !== this.props.params.Timestamp) {
        this._getGridData();
      }
    }
  }, {
    key: "_getGridData",
    value: function _getGridData() {
      var _this2 = this;

      this.props.toggleLoader(true);
      _lib_report__WEBPACK_IMPORTED_MODULE_8__["default"].fetchGridData(_lib_service__WEBPACK_IMPORTED_MODULE_10__["Url"], {
        xsrfToken: this.props.xsrfToken,
        data: this.props.params
      }).then(function (response) {
        var result = response.data;
        var mainData = result.Data;

        if (mainData && mainData.length > 1) {
          _lib_service__WEBPACK_IMPORTED_MODULE_10__["Service"].sort(mainData, _this2.props.params.SortBy, _this2.props.params.SortOrder);
          var sortedResult = Object.assign({}, result, {
            Data: mainData
          });

          _this2.setState({
            gridData: sortedResult
          });
        } else {
          _this2.setState({
            gridData: result
          });
        }

        _this2.props.setReportTitle(_lib_service__WEBPACK_IMPORTED_MODULE_10__["Service"].getReportTitle(_this2.props.params.FromDate, _this2.props.params.ToDate, _this2.props.params.CurrencyId, _this2.props.params.CurrencyName, _this2.props.params.BaseCurrency));

        _this2.props.toggleLoader(false);
      }).catch(function (error) {
        _lib_service__WEBPACK_IMPORTED_MODULE_10__["Service"].showErrorMsg();

        _this2.props.toggleLoader(false);
      });
    }
  }, {
    key: "_onExpandTurnOverColumn",
    value: function _onExpandTurnOverColumn(e) {
      e.stopPropagation();
      this.setState(function (prevState) {
        return {
          expandTurnover: !prevState.expandTurnover
        };
      });
    }
  }, {
    key: "_onExpandLicenseeColumn",
    value: function _onExpandLicenseeColumn(e) {
      e.stopPropagation();
      this.setState(function (prevState) {
        return {
          expandLicensee: !prevState.expandLicensee
        };
      });
    }
  }, {
    key: "_buildHeader",
    value: function _buildHeader(selectedProductList) {
      var _this3 = this;

      var productsCount = selectedProductList.length;
      var _this$state = this.state,
          expandLicensee = _this$state.expandLicensee,
          expandTurnover = _this$state.expandTurnover;
      var rowSpan = productsCount > 1 && (expandLicensee || expandTurnover) ? 2 : 1;
      var rows = [react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderRow"], {
        key: "header1",
        style: {
          height: 32
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 50,
        rowSpan: rowSpan
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].index), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 150,
        rowSpan: rowSpan,
        sortBy: 'Date'
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].date), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 100,
        rowSpan: rowSpan,
        sortBy: 'CurrencyName'
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].currency), productsCount > 1 ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 200 * (productsCount * expandTurnover + 1) - productsCount,
        rowSpan: expandTurnover ? 1 : rowSpan,
        colSpan: productsCount * expandTurnover + 1,
        sortBy: !expandTurnover ? 'TotalTurnOver' : ''
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].turnover, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
        className: "header-button btn ".concat(expandTurnover ? 'btnCollapse' : ''),
        onClick: function onClick(e) {
          return _this3._onExpandTurnOverColumn(e);
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
        className: "btn-icon icon-arrow"
      }))) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 200,
        rowSpan: rowSpan,
        sortBy: 'TotalTurnOver'
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].turnover), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 130,
        rowSpan: rowSpan,
        sortBy: 'TotalTransaction'
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].totalTransaction), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 200,
        rowSpan: rowSpan,
        sortBy: 'CustomerWinLoss'
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].customer), productsCount > 1 ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 200 * (productsCount * expandLicensee + 1) - productsCount,
        rowSpan: expandLicensee ? 1 : rowSpan,
        colSpan: productsCount * expandLicensee + 1,
        sortBy: !expandLicensee ? 'TotalLicenseeWL' : ''
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].licenseeWL, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
        className: "header-button btn ".concat(expandLicensee ? 'btnCollapse' : ''),
        onClick: function onClick(e) {
          return _this3._onExpandLicenseeColumn(e);
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
        className: "btn-icon icon-arrow"
      }))) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
        colWidth: 200,
        rowSpan: rowSpan,
        sortBy: 'TotalLicenseeWL'
      }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].licenseeWL))];

      if (rowSpan > 1) {
        var cols = [];

        if (this.state.expandTurnover) {
          for (var i = 0; i < productsCount; i++) {
            var code = selectedProductList[i];
            var colName = "TurnOver".concat(code);
            cols.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
              key: colName,
              colWidth: 200,
              sortBy: colName
            }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"][code]));
          }

          cols.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
            key: "turnover-total",
            colWidth: 200,
            sortBy: 'TotalTurnOver'
          }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].total));
        }

        if (this.state.expandLicensee) {
          for (var _i = 0; _i < productsCount; _i++) {
            var _code = selectedProductList[_i];

            var _colName = "LicenseeWL".concat(_code);

            cols.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
              key: _colName,
              colWidth: 200,
              sortBy: _colName
            }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"][_code]));
          }

          cols.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
            key: "licenseeWL-total",
            colWidth: 200,
            sortBy: 'TotalLicenseeWL'
          }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["HeaderText"].total));
        }

        rows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["HeaderRow"], {
          key: "header2",
          style: {
            height: 32
          }
        }, cols));
      }

      return rows;
    }
  }, {
    key: "_buildBody",
    value: function _buildBody(reportBy, selectedProductList) {
      var data = this.state.gridData.Data,
          formatDate = reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_9__["ReportBy"].DAILY.toString() ? 'MM/DD/YYYY' : 'MM/YYYY';
      var rows = [];

      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        var _reportBy = moment__WEBPACK_IMPORTED_MODULE_0___default()(item.Date).format(formatDate);

        rows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Row"], {
          key: "".concat(item.Ticks, "-").concat(item.CurrencyId)
        }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          title: i + 1,
          className: "center-align"
        }, i + 1), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          title: _reportBy,
          className: "center-align"
        }, _reportBy), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          title: item.CurrencyName,
          className: "center-align"
        }, item.CurrencyName), this._buildCell(item, selectedProductList)));
      }

      return rows;
    }
  }, {
    key: "_buildFooter",
    value: function _buildFooter(selectedProductList) {
      var totalRows = [];
      var total = this.state.gridData.Total,
          colSpan = 2,
          rowSpan = total.length;

      for (var i = 0; i < rowSpan; i++) {
        var item = total[i];
        totalRows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Row"], {
          key: item.CurrencyName,
          className: "fixed-table-total"
        }, i === 0 && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          title: _lib_service__WEBPACK_IMPORTED_MODULE_10__["TotalText"].total,
          className: "center-align",
          rowSpan: rowSpan,
          colSpan: colSpan
        }, _lib_service__WEBPACK_IMPORTED_MODULE_10__["TotalText"].total), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          title: item.CurrencyName,
          className: "center-align"
        }, item.CurrencyName), this._buildCell(item, selectedProductList)));
      }

      var dataSummary = this.state.gridData.SummaryTotal,
          baseCurrencyList = Object.keys(dataSummary),
          colSummarySpan = colSpan + 1;

      for (var _i2 = baseCurrencyList.length - 1; _i2 >= 0; _i2--) {
        var currency = baseCurrencyList[_i2],
            _item = dataSummary[currency];
        totalRows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Row"], {
          key: "tr-grandtotal".concat(_i2),
          className: "fixed-table-grant-total"
        }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          title: "".concat(_lib_service__WEBPACK_IMPORTED_MODULE_10__["TotalText"].totalIn, " ").concat(currency),
          className: "center-align",
          colSpan: colSummarySpan
        }, "".concat(_lib_service__WEBPACK_IMPORTED_MODULE_10__["TotalText"].totalIn, " ").concat(currency)), this._buildCell(_item, selectedProductList)));
      }

      return totalRows;
    }
  }, {
    key: "_buildCell",
    value: function _buildCell(item, selectedProductList) {
      var turnover = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_6__["default"].formatDecimal(item.TotalTurnOver),
          customerWl = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_6__["default"].formatDecimal(item.CustomerWinLoss),
          licenseeWL = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_6__["default"].formatDecimal(item.TotalLicenseeWL),
          totalTransaction = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_6__["default"].format(item.TotalTransaction, 0);
      var productsCount = selectedProductList.length;

      if (productsCount === 1) {
        var _rows = [react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          key: "turnover",
          title: turnover,
          className: "right-align"
        }, turnover), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          key: "totalTransaction",
          title: totalTransaction,
          className: "right-align"
        }, totalTransaction), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          key: "customerWl",
          title: customerWl,
          className: "right-align"
        }, customerWl), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
          key: "licenseeWL",
          title: licenseeWL,
          className: "right-align ".concat(item.TotalLicenseeWL < 0 ? 'negative' : '')
        }, licenseeWL)];
        return _rows;
      }

      var rows = [];

      if (this.state.expandTurnover) {
        for (var i = 0; i < productsCount; i++) {
          var column = 'TurnOver' + selectedProductList[i];
          var turnoverByProduct = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_6__["default"].formatDecimal(item[column]);
          rows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
            key: column,
            title: turnoverByProduct,
            className: "right-align"
          }, turnoverByProduct));
        }
      }

      rows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
        key: "turnover",
        title: turnover,
        className: "right-align"
      }, turnover), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
        key: "totalTransaction",
        title: totalTransaction,
        className: "right-align"
      }, totalTransaction), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
        key: "customerWl",
        title: customerWl,
        className: "right-align"
      }, customerWl));

      if (this.state.expandLicensee) {
        for (var _i3 = 0; _i3 < productsCount; _i3++) {
          var _column = 'LicenseeWL' + selectedProductList[_i3];

          var licenseeWLByProduct = _lib_numberFormat__WEBPACK_IMPORTED_MODULE_6__["default"].formatDecimal(item[_column]);
          rows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
            key: _column,
            title: licenseeWLByProduct,
            className: "right-align ".concat(item[_column] < 0 ? 'negative' : '')
          }, licenseeWLByProduct));
        }
      }

      rows.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Cell"], {
        key: "licenseeWL",
        title: licenseeWL,
        className: "right-align ".concat(item.TotalLicenseeWL < 0 ? 'negative' : '')
      }, licenseeWL));
      return rows;
    }
  }, {
    key: "render",
    value: function render() {
      var data = this.state.gridData.Data;

      if (!data) {
        return null;
      }

      var params = this.props.params;

      if (!data.length) {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_NoDataTitle__WEBPACK_IMPORTED_MODULE_7__["default"], null);
      }

      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_9softstudio_react_grid__WEBPACK_IMPORTED_MODULE_5__["Table"], {
        minWidth: 800,
        autoWidth: true,
        bodyHeight: 300,
        header: this._buildHeader(params.ProductCodeList),
        body: this._buildBody(params.ReportBy, params.ProductCodeList),
        footer: this._buildFooter(params.ProductCodeList),
        onSort: this._sort
      });
    }
  }]);

  return DataGrid;
}(react__WEBPACK_IMPORTED_MODULE_1__["Component"]);

function mapDispatchToProps(dispatch) {
  return Object(redux__WEBPACK_IMPORTED_MODULE_4__["bindActionCreators"])(_actions_index_js__WEBPACK_IMPORTED_MODULE_3__["ActionCreators"], dispatch);
}

function mapStateToProps(state) {
  var params = state.params,
      xsrfToken = state.xsrfToken;
  return Object.assign({}, {
    params: params,
    xsrfToken: xsrfToken
  });
}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(DataGrid));

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/components/FormFilter.jsx":
/*!************************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/components/FormFilter.jsx ***!
  \************************************************************************************/
/*! exports provided: FormFilter, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormFilter", function() { return FormFilter; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/index.js */ "./www/js/source/reactpages/pages/speciallicenseewl/actions/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.es.js");
/* harmony import */ var _9softstudio_react_multiselect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @9softstudio/react-multiselect */ "./node_modules/@9softstudio/react-multiselect/dist/index.js");
/* harmony import */ var _9softstudio_react_multiselect__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_9softstudio_react_multiselect__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jsroot/lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
/* harmony import */ var _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jsroot/lib/site */ "./www/js/source/reactpages/lib/site.js");
/* harmony import */ var _jsroot_lib_report__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @jsroot/lib/report */ "./www/js/source/reactpages/lib/report.js");
/* harmony import */ var _lib_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/service */ "./www/js/source/reactpages/pages/speciallicenseewl/lib/service.js");
/* harmony import */ var _lib_reportExcel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/reportExcel */ "./www/js/source/reactpages/pages/speciallicenseewl/lib/reportExcel.js");
/* harmony import */ var _jsroot_components_month_picker_index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @jsroot/components/month-picker/index */ "./www/js/source/reactpages/components/month-picker/index.js");
/* harmony import */ var _jsroot_lib_AppData__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @jsroot/lib/AppData */ "./www/js/source/reactpages/lib/AppData.js");
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

      if (!_this.isValidModel) {
        return;
      }

      var params = _this._getParams();

      if (!params) {
        return;
      }

      _this.props.setParams(params);
    });

    _defineProperty(_assertThisInitialized(_this), "exportExcel", function (event) {
      event.preventDefault();

      var params = _this._getParams();

      if (!params) {
        return;
      }

      _this.props.toggleLoader(true);

      _jsroot_lib_report__WEBPACK_IMPORTED_MODULE_8__["default"].fetchGridData(_lib_service__WEBPACK_IMPORTED_MODULE_9__["Url"], {
        xsrfToken: _this.props.xsrfToken,
        data: params
      }).then(function (response) {
        _this._doExportExcel(params, response.data);
      }).catch(function (error) {
        _lib_service__WEBPACK_IMPORTED_MODULE_9__["Service"].showErrorMsg();

        _this.props.toggleLoader(false);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "productChangeHandler", function (currentItem, selectedItemsKey) {
      _this.props.setSelectedProduct(selectedItemsKey);
    });

    _defineProperty(_assertThisInitialized(_this), "_monthPickerHandle", function (dateRange) {
      _this.props.setDateRange(dateRange);
    });

    return _this;
  }

  _createClass(FormFilter, [{
    key: "_doExportExcel",
    value: function _doExportExcel(params, gridData) {
      var _this2 = this;

      if (!gridData.Data || !gridData.Data.length) {
        this.props.toggleLoader(false);
        alert(_jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource("NoInfo"));
        return;
      }

      if (gridData.Data.length > 1) {
        _lib_service__WEBPACK_IMPORTED_MODULE_9__["Service"].sort(gridData.Data, params.SortBy, params.SortOrder);
      }

      var title = _lib_service__WEBPACK_IMPORTED_MODULE_9__["Service"].getReportTitle(params.FromDate, params.ToDate, params.CurrencyId, params.CurrencyName, params.BaseCurrency);
      var excel = new _lib_reportExcel__WEBPACK_IMPORTED_MODULE_10__["default"](gridData, title, parseInt(params.ReportBy, 10), params.ProductCodeList);
      excel.export(function () {
        _this2.props.toggleLoader(false);
      });
    }
  }, {
    key: "_getParams",
    value: function _getParams() {
      if (!this.props.xsrfToken) {
        return null;
      }

      var _this$props$dateRange = this.props.dateRange,
          fromDate = _this$props$dateRange.fromDate,
          toDate = _this$props$dateRange.toDate;
      return {
        FromDate: _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__["default"].convertDateToString(fromDate),
        ToDate: _jsroot_lib_site__WEBPACK_IMPORTED_MODULE_7__["default"].convertDateToString(toDate),
        CurrencyName: this.props.selectedCurrency.label,
        CurrencyId: this.props.selectedCurrency.value,
        BaseCurrency: this.props.selectedCurrency.baseCurrency,
        ProductCodeList: this.props.selectedProduct.split(','),
        ReportBy: this.props.selectedReportBy,
        SortBy: this.props.params.SortBy,
        SortOrder: this.props.params.SortOrder,
        Timestamp: new Date().getTime()
      };
    }
  }, {
    key: "_renderReportByOption",
    value: function _renderReportByOption() {
      var _this3 = this;

      var _this$props = this.props,
          reportByList = _this$props.reportByList,
          selectedReportBy = _this$props.selectedReportBy;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('ReportBy')), reportByList.map(function (option, i) {
        var key = 'ReportBy' + i;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          key: "Group".concat(key)
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "radio",
          value: option.value,
          checked: selectedReportBy === option.value,
          id: key,
          onChange: function onChange(event) {
            return _this3.props.setSelectedReportBy(event.target.value);
          }
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          htmlFor: key
        }, option.label));
      }));
    }
  }, {
    key: "_renderProductSelectList",
    value: function _renderProductSelectList() {
      var productOptions = _jsroot_lib_AppData__WEBPACK_IMPORTED_MODULE_12__["default"].productOptions;
      return productOptions && productOptions.length && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_9softstudio_react_multiselect__WEBPACK_IMPORTED_MODULE_5___default.a, {
        id: "ProductList",
        language: _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].currentLanguage,
        dataSource: productOptions,
        keyField: "Code",
        valueField: "Name",
        statusField: "Status",
        onChange: this.productChangeHandler
      });
    }
  }, {
    key: "_renderCurrencySelectList",
    value: function _renderCurrencySelectList() {
      var _this4 = this;

      var selectedCurrency = this.props.selectedCurrency;
      var currencyList = _jsroot_lib_AppData__WEBPACK_IMPORTED_MODULE_12__["default"].currencyList;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_4__["default"], {
        instanceId: "ddlCurrency",
        value: selectedCurrency.value,
        options: currencyList,
        onChange: function onChange(item) {
          return _this4.props.setSelectedCurrency(item);
        }
      });
    }
  }, {
    key: "_renderMonthPicker",
    value: function _renderMonthPicker() {
      var dateRange = this.props.dateRange;
      var dateConstraint = _jsroot_lib_AppData__WEBPACK_IMPORTED_MODULE_12__["default"].dateConstraint;
      var monthOption = {
        label: _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('ViewDataInMonth')
      };
      var fromDateOption = {
        label: _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('From'),
        id: 'FromDateInput'
      };
      var toDateOption = {
        label: _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource('To'),
        id: 'ToDateInput'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_jsroot_components_month_picker_index__WEBPACK_IMPORTED_MODULE_11__["default"], {
        minDate: dateConstraint.minDate,
        maxDate: dateConstraint.maxDate,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        onChange: this._monthPickerHandle,
        monthOption: monthOption,
        fromDateOption: fromDateOption,
        toDateOption: toDateOption
      });
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "page-filter"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-md-5 col-sm-12 col-lg-5 col-xl-5"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, this._renderMonthPicker())), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-md-3 col-sm-12 col-lg-2 col-xl-2"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource("Currency")), this._renderCurrencySelectList())), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-md-4 col-sm-12 col-lg-3 col-xl-2"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label-text"
      }, _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource("Product")), this._renderProductSelectList())), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-md-5 col-sm-12 col-lg-2 col-xl-3"
      }, this._renderReportByOption()), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-12 col-md-3 col-sm-12 col-lg-2 col-xl-2"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "button-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        disabled: !this.isValidModel,
        type: "button",
        className: "btn btn-submit",
        onClick: this.submit
      }, _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource("Submit")))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "caret-block"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "icon-excel right",
        onClick: this.exportExcel,
        title: _jsroot_lib_langHelper__WEBPACK_IMPORTED_MODULE_6__["default"].getSingleResource("ExportToExcel")
      }))));
    }
  }, {
    key: "isValidModel",
    get: function get() {
      return this.props.selectedProduct !== "";
    }
  }]);

  return FormFilter;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

function mapDispatchToProps(dispatch) {
  return Object(redux__WEBPACK_IMPORTED_MODULE_3__["bindActionCreators"])(_actions_index_js__WEBPACK_IMPORTED_MODULE_2__["ActionCreators"], dispatch);
}

function mapStateToProps(state) {
  var gridData = state.gridData,
      reportTitle = state.reportTitle,
      isLoading = state.isLoading,
      rest = _objectWithoutProperties(state, ["gridData", "reportTitle", "isLoading"]);

  return Object.assign({}, rest);
}

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(FormFilter));

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/components/index.jsx":
/*!*******************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/components/index.jsx ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _AppContainer_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AppContainer.jsx */ "./www/js/source/reactpages/pages/speciallicenseewl/components/AppContainer.jsx");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _reducers_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reducers/index.js */ "./www/js/source/reactpages/pages/speciallicenseewl/reducers/index.js");
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







var defaultState = Object.assign({}, window.initialState, {
  reportTitle: ''
}, {
  params: {
    SortBy: 'Date',
    SortOrder: 'asc'
  }
});
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


react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(App, null), document.getElementById("app-container"));

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/lib/reportExcel.js":
/*!*****************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/lib/reportExcel.js ***!
  \*****************************************************************************/
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
/* harmony import */ var _lib_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/service */ "./www/js/source/reactpages/pages/speciallicenseewl/lib/service.js");
/* harmony import */ var _constants_report__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../constants/report */ "./www/js/source/reactpages/constants/report.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }







var TITLE_ROW_INDEX = 0;
var HEADER_ROW_INDEX = 1;
var MIN_COLUMN = 7;
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
    var reportBy = arguments.length > 2 ? arguments[2] : undefined;
    var productCodes = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, ReportExcel);

    this.worksheet = {};
    this.title = title;
    this.fileName = "LicenseeWinLoss";
    this.gridData = gridData;
    this.reportBy = reportBy;
    this.productCodes = productCodes;
    this.productCount = productCodes.length;
    this.currentRowIndex = HEADER_ROW_INDEX + (this.productCount > 1 ? 2 : 1);
    this.totalColumn = MIN_COLUMN + this.productCount * 2;
    this.configColumn = this._getConfigColumn(reportBy);
    this.colSpanConfig = this._getColSpanConfig();
    this.mergeConfig = [];
  }

  _createClass(ReportExcel, [{
    key: "export",
    value: function _export(onFinished) {
      var _this = this;

      if (!this.gridData.Data || !this.gridData.Data.length) {
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
    value: function _getColSpanConfig() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, TOTAL_SECTION, {
        colSpan: 2,
        text: _lib_service__WEBPACK_IMPORTED_MODULE_4__["TotalText"].total,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].rowspan
      }), _defineProperty(_ref, SUMMARYTOTAL_SECTION, {
        colSpan: 3,
        text: _lib_service__WEBPACK_IMPORTED_MODULE_4__["TotalText"].totalIn,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].rowspan
      }), _ref;
    }
  }, {
    key: "_getConfigColumn",
    value: function _getConfigColumn(reportBy) {
      var _ref2, _ref3, _ref4, _rows$push, _rows$push2;

      var rowSpan = this.productCount > 1 ? 2 : 1;
      var rows = [(_ref2 = {
        field: 'Index',
        type: 's'
      }, _defineProperty(_ref2, HEADER_SECTION, {
        title: 'index',
        isShow: true,
        rowSpan: rowSpan,
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
        title: 'date',
        isShow: true,
        rowSpan: rowSpan
      }), _defineProperty(_ref3, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].center,
        width: 150
      }), _defineProperty(_ref3, TOTAL_SECTION, {
        isShow: false
      }), _defineProperty(_ref3, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref3), (_ref4 = {
        field: 'CurrencyName',
        type: 's'
      }, _defineProperty(_ref4, HEADER_SECTION, {
        title: 'currency',
        isShow: true,
        rowSpan: rowSpan
      }), _defineProperty(_ref4, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].center,
        width: 100
      }), _defineProperty(_ref4, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].center
      }), _defineProperty(_ref4, SUMMARYTOTAL_SECTION, {
        isShow: false
      }), _ref4)];

      this._createExpandColumns('TurnOver', 'turnover', rows, 3, false);

      rows.push((_rows$push = {
        field: 'TotalTransaction',
        type: 'n'
      }, _defineProperty(_rows$push, HEADER_SECTION, {
        title: 'totalTransaction',
        isShow: true,
        rowSpan: rowSpan,
        index_r: HEADER_ROW_INDEX
      }), _defineProperty(_rows$push, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].number,
        width: 130
      }), _defineProperty(_rows$push, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].number
      }), _defineProperty(_rows$push, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].number
      }), _rows$push), (_rows$push2 = {
        field: 'CustomerWinLoss',
        type: 'n'
      }, _defineProperty(_rows$push2, HEADER_SECTION, {
        title: 'customer',
        isShow: true,
        rowSpan: rowSpan,
        index_r: HEADER_ROW_INDEX
      }), _defineProperty(_rows$push2, MAIN_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
        width: 200
      }), _defineProperty(_rows$push2, TOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal
      }), _defineProperty(_rows$push2, SUMMARYTOTAL_SECTION, {
        isShow: true,
        style: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal
      }), _rows$push2));

      this._createExpandColumns('LicenseeWL', 'licenseeWL', rows, this.totalColumn - (this.productCount > 1 ? this.productCount + 1 : 1), true);

      return rows;
    }
  }, {
    key: "_createExpandColumns",
    value: function _createExpandColumns(name, title, rows, colIndex, hasNegativeStyle) {
      if (this.productCount > 1) {
        var _rows$push3, _rows$push5;

        rows.push((_rows$push3 = {}, _defineProperty(_rows$push3, HEADER_SECTION, {
          title: title,
          isShow: true,
          rowSpan: this.productCount > 1 ? 1 : rowSpan,
          colSpan: this.productCount + 1
        }), _defineProperty(_rows$push3, MAIN_SECTION, {
          isShow: false
        }), _defineProperty(_rows$push3, TOTAL_SECTION, {
          isShow: false
        }), _defineProperty(_rows$push3, SUMMARYTOTAL_SECTION, {
          isShow: false
        }), _rows$push3));

        for (var i = 0; i < this.productCount; i++) {
          var _rows$push4;

          var code = this.productCodes[i];
          rows.push((_rows$push4 = {
            field: name + code,
            type: 'n'
          }, _defineProperty(_rows$push4, HEADER_SECTION, {
            title: code,
            isShow: true,
            index_c: colIndex + i,
            index_r: HEADER_ROW_INDEX + 1
          }), _defineProperty(_rows$push4, MAIN_SECTION, {
            hasNegativeStyle: hasNegativeStyle,
            style: hasNegativeStyle ? {
              positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
              negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].negativeDecimal
            } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
            isShow: true,
            width: 200
          }), _defineProperty(_rows$push4, TOTAL_SECTION, {
            hasNegativeStyle: hasNegativeStyle,
            style: hasNegativeStyle ? {
              positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
              negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].negativeDecimal
            } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
            isShow: true
          }), _defineProperty(_rows$push4, SUMMARYTOTAL_SECTION, {
            hasNegativeStyle: hasNegativeStyle,
            style: hasNegativeStyle ? {
              positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
              negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].negativeDecimal
            } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
            isShow: true
          }), _rows$push4));
        }

        rows.push((_rows$push5 = {
          field: 'Total' + name,
          type: 'n'
        }, _defineProperty(_rows$push5, HEADER_SECTION, {
          title: 'total',
          isShow: true
        }), _defineProperty(_rows$push5, MAIN_SECTION, {
          hasNegativeStyle: hasNegativeStyle,
          style: hasNegativeStyle ? {
            positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
            negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].negativeDecimal
          } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
          isShow: true,
          width: 200
        }), _defineProperty(_rows$push5, TOTAL_SECTION, {
          hasNegativeStyle: hasNegativeStyle,
          style: hasNegativeStyle ? {
            positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
            negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].negativeDecimal
          } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
          isShow: true
        }), _defineProperty(_rows$push5, SUMMARYTOTAL_SECTION, {
          hasNegativeStyle: hasNegativeStyle,
          style: hasNegativeStyle ? {
            positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
            negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].negativeDecimal
          } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
          isShow: true
        }), _rows$push5));
      } else {
        var _rows$push6;

        rows.push((_rows$push6 = {
          field: name + this.productCodes[0],
          type: 'n'
        }, _defineProperty(_rows$push6, HEADER_SECTION, {
          title: title,
          isShow: true
        }), _defineProperty(_rows$push6, MAIN_SECTION, {
          hasNegativeStyle: hasNegativeStyle,
          style: hasNegativeStyle ? {
            positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
            negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].negativeDecimal
          } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["bodyCellStyle"].decimal,
          isShow: true,
          width: 200
        }), _defineProperty(_rows$push6, TOTAL_SECTION, {
          hasNegativeStyle: hasNegativeStyle,
          style: hasNegativeStyle ? {
            positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
            negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].negativeDecimal
          } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["totalCellStyle"].decimal,
          isShow: true
        }), _defineProperty(_rows$push6, SUMMARYTOTAL_SECTION, {
          hasNegativeStyle: hasNegativeStyle,
          style: hasNegativeStyle ? {
            positive: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
            negative: _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].negativeDecimal
          } : _constants_excelStyle__WEBPACK_IMPORTED_MODULE_3__["grandTotalCellStyle"].decimal,
          isShow: true
        }), _rows$push6));
      }
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
      var totalData = this.gridData.Data.length;

      for (var i = 0; i < totalData; i++) {
        var data = this.gridData.Data[i];
        data.Date = moment__WEBPACK_IMPORTED_MODULE_0___default()(data.Date).format(this.reportBy === _constants_report__WEBPACK_IMPORTED_MODULE_5__["ReportBy"].DAILY ? "MM/DD/YYYY" : "MM/YYYY");
        data.Index = i + 1;

        this._createRowBySection(MAIN_SECTION, 0, this.currentRowIndex, data);

        ++this.currentRowIndex;
      }
    }
  }, {
    key: "_createTotalData",
    value: function _createTotalData() {
      var totalData = this.gridData.Total.length;
      var totalColSpanConfig = this.colSpanConfig[TOTAL_SECTION];

      this._createMergeTotalDataColumn(this.currentRowIndex, totalData, 0, totalColSpanConfig.colSpan, totalColSpanConfig.text, totalColSpanConfig.style);

      for (var i = 0; i < totalData; i++) {
        var data = this.gridData.Total[i];

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

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/lib/service.js":
/*!*************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/lib/service.js ***!
  \*************************************************************************/
/*! exports provided: Url, HeaderText, TotalText, Service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Url", function() { return Url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderText", function() { return HeaderText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TotalText", function() { return TotalText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Service", function() { return Service; });
/* harmony import */ var _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/langHelper */ "./www/js/source/reactpages/lib/langHelper.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var Url = 'api/SpecialLicenseeWinLossReport/Index';
var HeaderText = {
  index: '#',
  date: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Date'),
  currency: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Currency'),
  turnover: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Turnover'),
  totalTransaction: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('TotalTransaction'),
  customer: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('CustomerW_L'),
  licenseeWL: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('LicenseeW_L'),
  total: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Total'),
  SB: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('ProductSB'),
  NG: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('ProductNG')
};
var TotalText = {
  total: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Total'),
  totalIn: _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Totalin')
};

var sortNumber = function sortNumber(a, b) {
  return a - b;
};

var sortString = function sortString(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};

var Service =
/*#__PURE__*/
function () {
  function Service() {
    _classCallCheck(this, Service);
  }

  _createClass(Service, null, [{
    key: "getReportTitle",
    value: function getReportTitle(fromDate, toDate, currencyId, currencyName, baseCurrency) {
      var viewInByCurrency = currencyId == 0 ? _lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('AllCurrencies') : "".concat(_lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('Viewin').replace('{0}', baseCurrency.toUpperCase() || currencyName));
      return "".concat(_lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('LicenseeWinLoss'), ", GMT+8, ").concat(fromDate, " - ").concat(toDate, " - ").concat(viewInByCurrency);
    }
  }, {
    key: "showErrorMsg",
    value: function showErrorMsg() {
      alert(_lib_langHelper__WEBPACK_IMPORTED_MODULE_0__["default"].getSingleResource('ErrorProcessingMsg'));
    }
  }, {
    key: "sort",
    value: function sort(data, sortBy, sortOrder) {
      sortBy = sortBy === 'Date' ? 'Ticks' : sortBy;
      var compareFunc = null;

      if (sortBy === 'CurrencyName') {
        if (sortOrder === 'asc') {
          compareFunc = function compareFunc(a, b) {
            return sortString(a[sortBy], b[sortBy]);
          };
        } else {
          compareFunc = function compareFunc(a, b) {
            return sortString(b[sortBy], a[sortBy]);
          };
        }
      } else {
        if (sortOrder === 'asc') {
          compareFunc = function compareFunc(a, b) {
            return sortNumber(a[sortBy], b[sortBy]);
          };
        } else {
          compareFunc = function compareFunc(a, b) {
            return sortNumber(b[sortBy], a[sortBy]);
          };
        }
      }

      data.sort(compareFunc);
    }
  }]);

  return Service;
}();
;

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/reducers/filterHandlerReducer.js":
/*!*******************************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/reducers/filterHandlerReducer.js ***!
  \*******************************************************************************************/
/*! exports provided: reportByList, selectedReportBy, dateRange, xsrfToken, params, reportTitle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reportByList", function() { return reportByList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectedReportBy", function() { return selectedReportBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateRange", function() { return dateRange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xsrfToken", function() { return xsrfToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "params", function() { return params; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reportTitle", function() { return reportTitle; });
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
/* harmony import */ var _actions_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/types.js */ "./www/js/source/reactpages/pages/speciallicenseewl/actions/types.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var reportByList = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["GET_REPORTBY"], function (state, action) {
  return action.data;
}));
var selectedReportBy = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["SET_REPORTBY"], function (state, action) {
  return action.data;
}));
var dateRange = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["SET_DATE_RANGE"], function (state, action) {
  return action.data;
}));
var xsrfToken = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["GET_XSRF_TOKEN"], function (state, action) {
  return action.data;
}));
var params = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["SET_PARAMS"], function (state, action) {
  return action.data;
}));
var reportTitle = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _defineProperty({}, _actions_types_js__WEBPACK_IMPORTED_MODULE_1__["SET_REPORT_TITLE"], function (state, action) {
  return action.data;
}));

/***/ }),

/***/ "./www/js/source/reactpages/pages/speciallicenseewl/reducers/index.js":
/*!****************************************************************************!*\
  !*** ./www/js/source/reactpages/pages/speciallicenseewl/reducers/index.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _filterHandlerReducer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filterHandlerReducer.js */ "./www/js/source/reactpages/pages/speciallicenseewl/reducers/filterHandlerReducer.js");
/* harmony import */ var _reducers_productReducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../reducers/productReducer */ "./www/js/source/reactpages/reducers/productReducer.js");
/* harmony import */ var _reducers_currencyReducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../reducers/currencyReducer */ "./www/js/source/reactpages/reducers/currencyReducer.js");
/* harmony import */ var _reducers_loaderReducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../reducers/loaderReducer */ "./www/js/source/reactpages/reducers/loaderReducer.js");





/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])(Object.assign(_filterHandlerReducer_js__WEBPACK_IMPORTED_MODULE_1__, _reducers_productReducer__WEBPACK_IMPORTED_MODULE_2__, _reducers_currencyReducer__WEBPACK_IMPORTED_MODULE_3__, _reducers_loaderReducer__WEBPACK_IMPORTED_MODULE_4__)));

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

/***/ }),

/***/ "./www/js/source/reactpages/reducers/productReducer.js":
/*!*************************************************************!*\
  !*** ./www/js/source/reactpages/reducers/productReducer.js ***!
  \*************************************************************/
/*! exports provided: selectedProduct */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectedProduct", function() { return selectedProduct; });
/* harmony import */ var _actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/types */ "./www/js/source/reactpages/actions/types.js");
/* harmony import */ var _lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/createReducer.js */ "./www/js/source/reactpages/lib/createReducer.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var selectedProduct = Object(_lib_createReducer_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, _defineProperty({}, _actions_types__WEBPACK_IMPORTED_MODULE_0__["SET_SELECTED_PRODUCT"], function (state, action) {
  return action.data;
}));

/***/ })

/******/ });
//# sourceMappingURL=speciallicenseewl.chunk.js.map