// ==UserScript==
// @name              anti-redirect (typescript)
// @author            Axetroy
// @collaborator      Axetroy
// @description       GM脚本, 去除各搜索引擎/常用网站的重定向
// @version           2.0.0
// @update            2017-09-02 23:21:53
// @grant             GM_xmlhttpRequest
// @include           *www.baidu.com*
// @include           *tieba.baidu.com*
// @include           *v.baidu.com*
// @include           *www.google.*
// @include           *encrypted.google.com*
// @include           *www.so.com*
// @include           *www.zhihu.com*
// @include           *daily.zhihu.com*
// @include           *zhuanlan.zhihu.com*
// @include           *weibo.com*
// @include           *twitter.com*
// @include           *www.sogou.com*
// @connect           *
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @supportURL        http://www.burningall.com
// @run-at            document-start
// @contributionURL   troy450409405@gmail.com|alipay.com
// @downloadURL       https://github.com/axetroy/anti-redirect/raw/master/dist/anti-redirect.min.user.js
// @namespace         https://greasyfork.org/zh-CN/users/3400-axetroy
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// ==/UserScript==

// Github源码:https://github.com/axetroy/anti-redirect


/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Provider = (function () {
    function Provider() {
        this.test = /example/;
        this.config = { debug: false };
    }
    Provider.prototype.setConfig = function (config) {
        this.config = config;
        return this;
    };
    Provider.prototype.onScroll = function (aElementList) { };
    Provider.prototype.onHover = function (aElement) { };
    Provider.prototype.onInit = function () {
        return this;
    };
    return Provider;
}());
exports.Provider = Provider;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var throttle = __webpack_require__(6);
var debounce = __webpack_require__(7);
var inView = __webpack_require__(8);
exports.REDIRECT_NUM = 'redirect-num';
/**
 * 根据url上的路径匹配，去除重定向
 * @param {HTMLAnchorElement} aElement
 * @param {RegExp} tester
 * @param {boolean} debug
 */
function antiRedirect(aElement, tester, debug) {
    var matcher = tester.exec(aElement.href);
    if (!matcher || !matcher.length || !matcher[1])
        return;
    var url = '';
    try {
        url = decodeURIComponent(matcher[1]);
    }
    catch (e) {
        url = /https?:\/\//.test(matcher[1]) ? matcher[1] : '';
    }
    if (url) {
        aElement.setAttribute('origin-href', aElement.getAttribute('href'));
        aElement.href = url;
        debug && (aElement.style.backgroundColor = 'green');
    }
}
exports.antiRedirect = antiRedirect;
var Query = (function () {
    function Query(queryStr) {
        this.queryStr = queryStr;
        this.object = {};
        this.object = this.toObject(queryStr.replace(/^\?+/, ''));
    }
    Query.prototype.toObject = function (queryStr) {
        var obj = {};
        queryStr.split('&').forEach(function (item) {
            var arr = item.split('=') || [];
            var key = arr[0] || '';
            var value = arr[1] || '';
            try {
                key = decodeURIComponent(arr[0] || '');
                value = decodeURIComponent(arr[1] || '');
            }
            catch (err) { }
            key && (obj[key] = value);
        });
        return obj;
    };
    Query.prototype.toString = function () {
        var arr = [];
        for (var key in this.object) {
            if (this.object.hasOwnProperty(key)) {
                var value = this.object[key];
                arr.push(key + '=' + value);
            }
        }
        return arr.length ? '?' + arr.join('&') : '';
    };
    return Query;
}());
function queryParser(queryString) {
    return new Query(queryString);
}
exports.queryParser = queryParser;
function getText(htmlElement) {
    return (htmlElement.innerText || htmlElement.textContent).trim();
}
exports.getText = getText;
function throttleDecorator(wait, options) {
    if (options === void 0) { options = {}; }
    return function (target, name, descriptor) {
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function () {
                Object.defineProperty(this, name, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: throttle(descriptor.value, wait, options)
                });
                return this[name];
            }
        };
    };
}
exports.throttleDecorator = throttleDecorator;
function debounceDecorator(wait, options) {
    if (options === void 0) { options = {}; }
    return function (target, name, descriptor) {
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function () {
                Object.defineProperty(this, name, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: debounce(descriptor.value, wait, options)
                });
                return this[name];
            }
        };
    };
}
exports.debounceDecorator = debounceDecorator;
function isInView(element) {
    return inView.is(element);
}
exports.isInView = isInView;
function getRedirect(aElement) {
    return +(aElement.getAttribute(exports.REDIRECT_NUM) || 0);
}
exports.getRedirect = getRedirect;
function increaseRedirect(aElement) {
    var num = getRedirect(aElement);
    aElement.setAttribute(exports.REDIRECT_NUM, num + 1 + '');
}
exports.increaseRedirect = increaseRedirect;
function decreaseRedirect(aElement) {
    var num = getRedirect(aElement);
    if (num > 0) {
        aElement.setAttribute(exports.REDIRECT_NUM, num - 1 + '');
    }
}
exports.decreaseRedirect = decreaseRedirect;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["gmHttp"] = factory();
	else
		root["gmHttp"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by axetroy on 17-6-23.
 */
/// <reference path="./index.d.ts" />
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(func) {
    return typeof func === 'function';
}
var Http = (function () {
    function Http(config) {
        if (config === void 0) { config = {}; }
        this.config = config;
    }
    Http.prototype.setConfig = function (config) {
        if (config === void 0) { config = {}; }
        this.config = __assign({}, this.config, config);
    };
    Http.prototype.create = function (config) {
        return new Http(config);
    };
    Http.prototype.request = function (method, url, data, header, config) {
        var _this = this;
        if (data === void 0) { data = ''; }
        if (header === void 0) { header = {}; }
        if (config === void 0) { config = {}; }
        return new Promise(function (resolve, reject) {
            var commonRequestConfig = {
                method: method,
                url: url,
                data: data,
                header: header
            };
            var GM_xmlhttpRequestConfig = __assign({}, commonRequestConfig, config, _this.config);
            var onreadystatechange = GM_xmlhttpRequestConfig.onreadystatechange, onerror = GM_xmlhttpRequestConfig.onerror, onabort = GM_xmlhttpRequestConfig.onabort, ontimeout = GM_xmlhttpRequestConfig.ontimeout;
            GM_xmlhttpRequestConfig.synchronous = true; // async
            GM_xmlhttpRequestConfig.onreadystatechange = function (response) {
                try {
                    isFunction(onreadystatechange) &&
                        onreadystatechange.call(this, response);
                }
                catch (err) {
                    reject(err);
                }
                if (response.readyState !== 4)
                    return;
                response.status >= 200 && response.status < 400
                    ? resolve(response)
                    : reject(response);
            };
            GM_xmlhttpRequestConfig.onerror = function (response) {
                try {
                    isFunction(onerror) && onerror.call(this, response);
                    reject(response);
                }
                catch (err) {
                    reject(err);
                }
            };
            GM_xmlhttpRequestConfig.onabort = function (response) {
                try {
                    isFunction(onabort) && onabort.call(this, response);
                    reject(response);
                }
                catch (err) {
                    reject(err);
                }
            };
            GM_xmlhttpRequestConfig.ontimeout = function (response) {
                try {
                    isFunction(ontimeout) && ontimeout.call(this, response);
                    reject(response);
                }
                catch (err) {
                    reject(err);
                }
            };
            if (_this.config.debug) {
                console.log("%c[" + commonRequestConfig.method.toUpperCase() + "]%c: " + commonRequestConfig.url, 'color: green', 'color: #000;text-style: under-line');
            }
            GM_xmlhttpRequest(__assign({}, GM_xmlhttpRequestConfig));
        });
    };
    Http.prototype.get = function (url, data, header, config) {
        return this.request('GET', url, data, header, config);
    };
    Http.prototype.post = function (url, data, header, config) {
        return this.request('POST', url, data, header, config);
    };
    Http.prototype.put = function (url, data, header, config) {
        return this.request('PUT', url, data, header, config);
    };
    Http.prototype['delete'] = function (url, data, header, config) {
        return this.request('DELETE', url, data, header, config);
    };
    Http.prototype.head = function (url, data, header, config) {
        return this.request('HEAD', url, data, header, config);
    };
    return Http;
}());
exports.Http = Http;
var timeout = 5000;
exports.timeout = timeout;
var http = new Http({ timeout: timeout });
exports.http = http;
exports.default = http;


/***/ })
/******/ ]);
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gm_http_1 = __webpack_require__(2);
var app_1 = __webpack_require__(5);
var zhihu_zhuanlan_1 = __webpack_require__(9);
var zhihu_daily_1 = __webpack_require__(10);
var tieba_1 = __webpack_require__(11);
var google_1 = __webpack_require__(12);
var zhihu_1 = __webpack_require__(13);
var so_1 = __webpack_require__(14);
var weobo_1 = __webpack_require__(15);
var twitter_1 = __webpack_require__(16);
var sogou_1 = __webpack_require__(17);
var baidu_1 = __webpack_require__(18);
var baidu_video_1 = __webpack_require__(19);
var app = new app_1.App();
var isDebug = "production" !== 'production';
gm_http_1.default.setConfig({ debug: isDebug });
app
    .setConfig({
    debug: isDebug
})
    .provide({
    // 测试地址: https://www.zhihu.com/question/25258775
    name: '知乎',
    test: /www\.zhihu\.com/,
    provider: zhihu_1.ZhihuProvider
})
    .provide({
    // 测试地址: https://zhuanlan.zhihu.com/p/20549978
    name: '知乎专栏',
    test: /zhuanlan\.zhihu\.com/,
    provider: zhihu_zhuanlan_1.ZhihuZhuanlanProvider
})
    .provide({
    // 测试地址:
    name: '知乎日报',
    test: /daily\.zhihu\.com/,
    provider: zhihu_daily_1.ZhihuDailyProvider
})
    .provide({
    name: 'Google搜索',
    test: /\w+\.google\./,
    provider: google_1.GoogleProvider
})
    .provide({
    // 测试地址: https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&q=chrome
    name: '360搜索',
    test: /www\.so\.com/,
    provider: so_1.SoProvider
})
    .provide({
    name: '新浪微博',
    test: /\.weibo\.com/,
    provider: weobo_1.WeboProvider
})
    .provide({
    name: 'Twitter',
    test: /twitter\.com/,
    provider: twitter_1.TwitterProvider
})
    .provide({
    // 测试: http://www.sogou.com/web?query=chrome&_asf=www.sogou.com&_ast=&w=01019900&p=40040100&ie=utf8&from=index-nologin&s_from=index&sut=1527&sst0=1504347367611&lkt=0%2C0%2C0&sugsuv=00091651B48CA45F593B61A29B131405&sugtime=1504347367611
    name: '搜狗搜索',
    test: /www\.sogou\.com/,
    provider: sogou_1.SoGouProvider
})
    .provide({
    // 测试: https://www.baidu.com/s?wd=chrome&rsv_spt=1&rsv_iqid=0xcb136237000ed40e&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baidulocal&rsv_enter=1&rsv_sug3=7&rsv_sug1=7&rsv_sug7=101&rsv_sug2=0&inputT=813&rsv_sug4=989&timestamp=1504349229266&rn=50&vf_bl=1
    name: '百度搜索',
    test: /www\.baidu\.com/,
    provider: baidu_1.BaiduProvider
})
    .provide({
    // 测试: https://www.baidu.com/s?wd=chrome&rsv_spt=1&rsv_iqid=0xcb136237000ed40e&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baidulocal&rsv_enter=1&rsv_sug3=7&rsv_sug1=7&rsv_sug7=101&rsv_sug2=0&inputT=813&rsv_sug4=989&timestamp=1504349229266&rn=50&vf_bl=1
    name: '百度视频',
    test: /v\.baidu\.com/,
    provider: baidu_video_1.BaiduVideoProvider
})
    .provide({
    // 测试地址: http://tieba.baidu.com/p/5300844180
    name: '百度贴吧',
    test: /tieba\.baidu\.com/,
    provider: tieba_1.TiebaProvider
})
    .bootstrap();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(1);
var App = (function () {
    function App() {
        this.provides = [];
        this.onScrollHandler = [];
        this.onHoverHandler = [];
    }
    App.prototype.setConfig = function (config) {
        this.config = config;
        return this;
    };
    App.prototype.provide = function (provider) {
        this.provides.push(provider);
        return this;
    };
    App.prototype.getProvider = function () {
        var matchProviders = [];
        var provides = this.provides.slice();
        while (provides.length) {
            var provideConfig = provides.shift();
            // 匹配域名，适合正确
            if (provideConfig.test.test(document.domain)) {
                matchProviders.push(provideConfig);
            }
        }
        return matchProviders;
    };
    App.prototype.onHover = function (event) {
        var target = event.target;
        if (target.tagName !== 'A')
            return;
        this.onHoverHandler.forEach(function (func) {
            func(target);
        });
    };
    App.prototype.onScroll = function () {
        // 筛选所有在可视区域内的A标签
        var allInviewAElements = [].slice
            .call(document.querySelectorAll('a[href^="http"]'))
            .filter(function (aElement) {
            return utils_1.isInView(aElement) && utils_1.getRedirect(aElement) <= 2;
        });
        this.onScrollHandler.forEach(function (func) {
            func(allInviewAElements);
        });
    };
    App.prototype.bootstrap = function () {
        var _this = this;
        addEventListener('DOMContentLoaded', function () {
            var providers = _this.getProvider();
            while (providers.length) {
                var provideConfig = providers.shift();
                console.info("[Anti-redirect]: Load " + provideConfig.name);
                var providerConstructor = provideConfig.provider;
                var provider = new providerConstructor()
                    .setConfig(_this.config)
                    .onInit();
                _this.onScrollHandler.push(provider.onScroll.bind(provider));
                _this.onHoverHandler.push(provider.onHover.bind(provider));
            }
        });
        addEventListener('scroll', this.onScroll.bind(this));
        addEventListener('mousemove', this.onHover.bind(this));
        console.log('%c Anti-Redirect %c Copyright \xa9 2015-%s %s', 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:64px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;', 'font-size:12px;color:#999999;', new Date().getFullYear(), '\n' + 'Author @Axetroy');
    };
    return App;
}());
__decorate([
    utils_1.debounceDecorator(300)
], App.prototype, "onScroll", null);
exports.App = App;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * in-view 0.6.1 - Get notified when a DOM element enters or exits the viewport.
 * Copyright (c) 2016 Cam Wiegert <cam@camwiegert.com> - https://camwiegert.github.io/in-view
 * License: MIT
 */
!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.inView=e():t.inView=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}var i=n(2),o=r(i);t.exports=o["default"]},function(t,e){function n(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}t.exports=n},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(9),o=r(i),u=n(3),f=r(u),s=n(4),c=function(){if("undefined"!=typeof window){var t=100,e=["scroll","resize","load"],n={history:[]},r={offset:{},threshold:0,test:s.inViewport},i=(0,o["default"])(function(){n.history.forEach(function(t){n[t].check()})},t);e.forEach(function(t){return addEventListener(t,i)}),window.MutationObserver&&addEventListener("DOMContentLoaded",function(){new MutationObserver(i).observe(document.body,{attributes:!0,childList:!0,subtree:!0})});var u=function(t){if("string"==typeof t){var e=[].slice.call(document.querySelectorAll(t));return n.history.indexOf(t)>-1?n[t].elements=e:(n[t]=(0,f["default"])(e,r),n.history.push(t)),n[t]}};return u.offset=function(t){if(void 0===t)return r.offset;var e=function(t){return"number"==typeof t};return["top","right","bottom","left"].forEach(e(t)?function(e){return r.offset[e]=t}:function(n){return e(t[n])?r.offset[n]=t[n]:null}),r.offset},u.threshold=function(t){return"number"==typeof t&&t>=0&&t<=1?r.threshold=t:r.threshold},u.test=function(t){return"function"==typeof t?r.test=t:r.test},u.is=function(t){return r.test(t,r)},u.offset(0),u}};e["default"]=c()},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(){function t(e,r){n(this,t),this.options=r,this.elements=e,this.current=[],this.handlers={enter:[],exit:[]},this.singles={enter:[],exit:[]}}return r(t,[{key:"check",value:function(){var t=this;return this.elements.forEach(function(e){var n=t.options.test(e,t.options),r=t.current.indexOf(e),i=r>-1,o=n&&!i,u=!n&&i;o&&(t.current.push(e),t.emit("enter",e)),u&&(t.current.splice(r,1),t.emit("exit",e))}),this}},{key:"on",value:function(t,e){return this.handlers[t].push(e),this}},{key:"once",value:function(t,e){return this.singles[t].unshift(e),this}},{key:"emit",value:function(t,e){for(;this.singles[t].length;)this.singles[t].pop()(e);for(var n=this.handlers[t].length;--n>-1;)this.handlers[t][n](e);return this}}]),t}();e["default"]=function(t,e){return new i(t,e)}},function(t,e){"use strict";function n(t,e){var n=t.getBoundingClientRect(),r=n.top,i=n.right,o=n.bottom,u=n.left,f=n.width,s=n.height,c={t:o,r:window.innerWidth-u,b:window.innerHeight-r,l:i},a={x:e.threshold*f,y:e.threshold*s};return c.t>e.offset.top+a.y&&c.r>e.offset.right+a.x&&c.b>e.offset.bottom+a.y&&c.l>e.offset.left+a.x}Object.defineProperty(e,"__esModule",{value:!0}),e.inViewport=n},function(t,e){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(e,function(){return this}())},function(t,e,n){var r=n(5),i="object"==typeof self&&self&&self.Object===Object&&self,o=r||i||Function("return this")();t.exports=o},function(t,e,n){function r(t,e,n){function r(e){var n=x,r=m;return x=m=void 0,E=e,w=t.apply(r,n)}function a(t){return E=t,j=setTimeout(h,e),M?r(t):w}function l(t){var n=t-O,r=t-E,i=e-n;return _?c(i,g-r):i}function d(t){var n=t-O,r=t-E;return void 0===O||n>=e||n<0||_&&r>=g}function h(){var t=o();return d(t)?p(t):void(j=setTimeout(h,l(t)))}function p(t){return j=void 0,T&&x?r(t):(x=m=void 0,w)}function v(){void 0!==j&&clearTimeout(j),E=0,x=O=m=j=void 0}function y(){return void 0===j?w:p(o())}function b(){var t=o(),n=d(t);if(x=arguments,m=this,O=t,n){if(void 0===j)return a(O);if(_)return j=setTimeout(h,e),r(O)}return void 0===j&&(j=setTimeout(h,e)),w}var x,m,g,w,j,O,E=0,M=!1,_=!1,T=!0;if("function"!=typeof t)throw new TypeError(f);return e=u(e)||0,i(n)&&(M=!!n.leading,_="maxWait"in n,g=_?s(u(n.maxWait)||0,e):g,T="trailing"in n?!!n.trailing:T),b.cancel=v,b.flush=y,b}var i=n(1),o=n(8),u=n(10),f="Expected a function",s=Math.max,c=Math.min;t.exports=r},function(t,e,n){var r=n(6),i=function(){return r.Date.now()};t.exports=i},function(t,e,n){function r(t,e,n){var r=!0,f=!0;if("function"!=typeof t)throw new TypeError(u);return o(n)&&(r="leading"in n?!!n.leading:r,f="trailing"in n?!!n.trailing:f),i(t,e,{leading:r,maxWait:e,trailing:f})}var i=n(7),o=n(1),u="Expected a function";t.exports=r},function(t,e){function n(t){return t}t.exports=n}])});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var ZhihuZhuanlanProvider = (function (_super) {
    __extends(ZhihuZhuanlanProvider, _super);
    function ZhihuZhuanlanProvider() {
        var _this = _super.call(this) || this;
        _this.test = /link\.zhihu\.com\/\?target=(.*)/;
        return _this;
    }
    ZhihuZhuanlanProvider.prototype.onScroll = function (aElementList) { };
    ZhihuZhuanlanProvider.prototype.onHover = function (aElement) {
        utils_1.antiRedirect(aElement, this.test, this.config.debug);
    };
    return ZhihuZhuanlanProvider;
}(provider_1.Provider));
exports.ZhihuZhuanlanProvider = ZhihuZhuanlanProvider;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var ZhihuDailyProvider = (function (_super) {
    __extends(ZhihuDailyProvider, _super);
    function ZhihuDailyProvider() {
        var _this = _super.call(this) || this;
        _this.test = /zhihu\.com\/\?target=(.*)/;
        return _this;
    }
    ZhihuDailyProvider.prototype.onScroll = function (aElementList) { };
    ZhihuDailyProvider.prototype.onHover = function (aElement) {
        utils_1.antiRedirect(aElement, this.test, this.config.debug);
    };
    return ZhihuDailyProvider;
}(provider_1.Provider));
exports.ZhihuDailyProvider = ZhihuDailyProvider;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var TiebaProvider = (function (_super) {
    __extends(TiebaProvider, _super);
    function TiebaProvider() {
        var _this = _super.call(this) || this;
        _this.test = /jump\d*\.bdimg\.com/;
        return _this;
    }
    TiebaProvider.prototype.onScroll = function (aElementList) { };
    TiebaProvider.prototype.onHover = function (aElement) {
        if (!this.test.test(aElement.href))
            return;
        var url = '';
        var text = aElement.innerText || aElement.textContent || '';
        try {
            url = decodeURIComponent(text);
        }
        catch (e) {
            url = /https?:\/\//.test(text) ? text : '';
        }
        if (url) {
            aElement.href = url;
            this.config.debug && (aElement.style.backgroundColor = 'green');
        }
    };
    return TiebaProvider;
}(provider_1.Provider));
exports.TiebaProvider = TiebaProvider;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var GoogleProvider = (function (_super) {
    __extends(GoogleProvider, _super);
    function GoogleProvider() {
        var _this = _super.call(this) || this;
        _this.test = /nothing/;
        return _this;
    }
    GoogleProvider.prototype.onScroll = function (aElementList) { };
    GoogleProvider.prototype.onHover = function (aElement) {
        if (aElement.getAttribute('onmousedown')) {
            aElement.removeAttribute('onmousedown');
        }
        if (aElement.getAttribute('data-href')) {
            aElement.href = aElement.getAttribute('data-href');
            this.config.debug && (aElement.style.backgroundColor = 'green');
        }
    };
    return GoogleProvider;
}(provider_1.Provider));
exports.GoogleProvider = GoogleProvider;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var ZhihuProvider = (function (_super) {
    __extends(ZhihuProvider, _super);
    function ZhihuProvider() {
        var _this = _super.call(this) || this;
        _this.test = /zhihu\.com\/\?target=(.*)/;
        return _this;
    }
    ZhihuProvider.prototype.onScroll = function (aElementList) { };
    ZhihuProvider.prototype.onHover = function (aElement) {
        utils_1.antiRedirect(aElement, this.test, this.config.debug);
    };
    return ZhihuProvider;
}(provider_1.Provider));
exports.ZhihuProvider = ZhihuProvider;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var SoProvider = (function (_super) {
    __extends(SoProvider, _super);
    function SoProvider() {
        var _this = _super.call(this) || this;
        _this.test = /so\.com\/link\?url=(.*)/;
        return _this;
    }
    SoProvider.prototype.onScroll = function (aElementList) { };
    SoProvider.prototype.onHover = function (aElement) {
        utils_1.antiRedirect(aElement, this.test, this.config.debug);
        aElement.removeAttribute('data-res'); // 去除点击追踪
        aElement.href = aElement.href.replace(/\&(q|t|ts|src)=[^\&]*/g, '');
        var dataUrl = aElement.getAttribute('data-url');
        if (dataUrl) {
            aElement.setAttribute('origin-href', aElement.href);
            aElement.href = dataUrl;
            this.config.debug && (aElement.style.backgroundColor = 'green');
        }
    };
    return SoProvider;
}(provider_1.Provider));
exports.SoProvider = SoProvider;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var WeboProvider = (function (_super) {
    __extends(WeboProvider, _super);
    function WeboProvider() {
        var _this = _super.call(this) || this;
        _this.test = /t\.cn\/\w+/;
        return _this;
    }
    WeboProvider.prototype.onScroll = function (aElementList) { };
    WeboProvider.prototype.onHover = function (aElement) {
        if (!this.test.test(aElement.href) || !/^https?:\/\//.test(aElement.title))
            return;
        var url = decodeURIComponent(aElement.title);
        if (url) {
            aElement.href = url;
            this.config.debug && (aElement.style.backgroundColor = 'green');
        }
    };
    return WeboProvider;
}(provider_1.Provider));
exports.WeboProvider = WeboProvider;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = __webpack_require__(0);
var TwitterProvider = (function (_super) {
    __extends(TwitterProvider, _super);
    function TwitterProvider() {
        var _this = _super.call(this) || this;
        _this.test = /t\.co\/\w+/;
        return _this;
    }
    TwitterProvider.prototype.onScroll = function (aElementList) { };
    TwitterProvider.prototype.onHover = function (aElement) {
        if (!this.test.test(aElement.href) || !/^https?:\/\//.test(aElement.title))
            return;
        var url = decodeURIComponent(aElement.title);
        if (url) {
            aElement.href = url;
            this.config.debug && (aElement.style.backgroundColor = 'green');
        }
    };
    return TwitterProvider;
}(provider_1.Provider));
exports.TwitterProvider = TwitterProvider;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gm_http_1 = __webpack_require__(2);
var provider_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var SoGouProvider = (function (_super) {
    __extends(SoGouProvider, _super);
    function SoGouProvider() {
        var _this = _super.call(this) || this;
        _this.test = /www\.sogou\.com\/link\?url=/;
        return _this;
    }
    SoGouProvider.prototype.onScroll = function (aElementList) { };
    SoGouProvider.prototype.onHover = function (aElement) {
        var _this = this;
        if (!this.test.test(aElement.href))
            return;
        gm_http_1.default
            .get(aElement.href)
            .then(function (res) {
            if (res.finalUrl) {
                aElement.href = res.finalUrl;
                _this.config.debug && (aElement.style.backgroundColor = 'green');
            }
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    SoGouProvider.prototype.parsePage = function (res) {
        var _this = this;
        var responseText = res.responseText.replace(/(src=[^>]*|link=[^>])/g, '');
        var html = document.createElement('html');
        html.innerHTML = responseText;
        // let selector = '#main .results div.vrwrap>h3';
        // let selector = '#main .results h3>a';
        var selector = '#main .results a[href*="www.sogou.com/link?url="]';
        var remotes = [].slice.call(html.querySelectorAll('#main .results a[href]'));
        var locals = [].slice.call(document.querySelectorAll(selector));
        locals.forEach(function (localEle) {
            remotes.forEach(function (remoteEle) {
                var localText = utils_1.getText(localEle);
                var remoteText = utils_1.getText(remoteEle);
                // 通用按钮，例如【点击下载】
                if (localEle.classList.contains('str-public-btn')) {
                    localText = utils_1.getText(localEle.parentNode);
                    remoteText = utils_1.getText(remoteEle.parentNode);
                }
                else if (localEle.classList.contains('str_img')) {
                    // 图片
                    localText = utils_1.getText(localEle.parentNode.parentNode);
                    remoteText = utils_1.getText(remoteEle.parentNode.parentNode);
                }
                if (!localText || localText !== remoteText)
                    return;
                _this.test.test(localEle.href) &&
                    localEle.setAttribute('origin-href', localEle.href);
                localEle.href = remoteEle.href;
                _this.config.debug && (localEle.style.backgroundColor = 'red');
            });
        });
    };
    SoGouProvider.prototype.onInit = function () {
        var _this = this;
        if (!/www\.sogou\.com\/web/.test(window.top.location.href))
            return;
        var query = utils_1.queryParser(window.top.location.search);
        // 搜索使用http搜索，得到的是直接链接
        var url = location.protocol
            .replace(/:$/, '')
            .replace('s', '') + "://" + (location.host + location.pathname + query);
        gm_http_1.default
            .get(url)
            .then(function (res) {
            _this.parsePage(res);
        })
            .catch(function (err) {
            console.error(err);
        });
        return this;
    };
    return SoGouProvider;
}(provider_1.Provider));
__decorate([
    utils_1.throttleDecorator(500)
], SoGouProvider.prototype, "onHover", null);
exports.SoGouProvider = SoGouProvider;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var gm_http_1 = __webpack_require__(2);
var provider_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var BaiduProvider = (function (_super) {
    __extends(BaiduProvider, _super);
    function BaiduProvider() {
        var _this = _super.call(this) || this;
        _this.test = /www\.baidu\.com\/link\?url=/;
        return _this;
    }
    BaiduProvider.prototype.onScroll = function (aElementList) {
        var _this = this;
        aElementList.forEach(function (aElement) {
            if (utils_1.getRedirect(aElement) <= 2 && _this.test.test(aElement.href)) {
                utils_1.increaseRedirect(aElement);
                _this.handlerOneElement(aElement)
                    .then(function (res) {
                    utils_1.decreaseRedirect(aElement);
                })
                    .catch(function (err) {
                    console.error(err);
                    utils_1.decreaseRedirect(aElement);
                });
            }
        });
    };
    BaiduProvider.prototype.handlerOneElement = function (aElement) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gm_http_1.default.get(aElement.href)];
                    case 1:
                        res = _a.sent();
                        if (res.finalUrl) {
                            aElement.href = res.finalUrl;
                            this.config.debug && (aElement.style.backgroundColor = 'green');
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    BaiduProvider.prototype.onHover = function (aElement, callback) {
        if (!this.test.test(aElement.href))
            return;
        this.handlerOneElement(aElement).catch(function (err) {
            console.error(err);
        });
    };
    // private parsePage(res: Response$): void {}
    BaiduProvider.prototype.onInit = function () {
        // if (!/www\.baidu\.com\/s/.test(window.top.location.href)) return;
        // const query = queryParser(window.top.location.search);
        // const skip = query.object.pn || 0;
        //
        // query.object.tn = 'baidulocal';
        // query.object.timestamp = new Date().getTime();
        // query.object.rn = 50;
        //
        // const url: string = `${location.protocol.replace(
        //   /:$/,
        //   ''
        // )}://${location.host + location.pathname + query}`;
        //
        // Promise.all([
        //   http.get(url),
        //   http.get(url.replace(/pn=(\d+)/, `pn=${skip + 10}`))
        // ])
        //   .then((resList: Response$[]) => {
        //     if (!resList || !resList.length) return;
        //     resList.forEach(res => {
        //       return this.parsePage(res);
        //     });
        //   })
        //   .catch(err => {
        //     console.error(err);
        //   });
        return this;
    };
    return BaiduProvider;
}(provider_1.Provider));
__decorate([
    utils_1.throttleDecorator(500)
], BaiduProvider.prototype, "onHover", null);
exports.BaiduProvider = BaiduProvider;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gm_http_1 = __webpack_require__(2);
var provider_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var BaiduVideoProvider = (function (_super) {
    __extends(BaiduVideoProvider, _super);
    function BaiduVideoProvider() {
        var _this = _super.call(this) || this;
        _this.test = /v\.baidu\.com\/link\?url=/;
        return _this;
    }
    BaiduVideoProvider.prototype.onScroll = function (aElementList) { };
    BaiduVideoProvider.prototype.onHover = function (aElement) {
        var _this = this;
        if (!this.test.test(aElement.href))
            return;
        gm_http_1.default
            .get(aElement.href)
            .then(function (res) {
            if (res.finalUrl) {
                aElement.href = res.finalUrl;
                _this.config.debug && (aElement.style.backgroundColor = 'green');
            }
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    return BaiduVideoProvider;
}(provider_1.Provider));
__decorate([
    utils_1.throttleDecorator(500)
], BaiduVideoProvider.prototype, "onHover", null);
exports.BaiduVideoProvider = BaiduVideoProvider;


/***/ })
/******/ ]);