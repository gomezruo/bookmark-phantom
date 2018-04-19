webpackJsonp([0],{

/***/ 20:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),

/***/ 21:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 50:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_ui_router__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_ui_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_ui_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_states__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_config__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_common_module__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_scss__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__styles_scss__);
// Core


// Dependencies


// Angular config



// Modules


// Styles


// --- App Module -------------------
__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('app', ['ui.router', __WEBPACK_IMPORTED_MODULE_4__app_common_module__["a" /* default */].name]).config(__WEBPACK_IMPORTED_MODULE_2__app_states__["a" /* default */]).config(__WEBPACK_IMPORTED_MODULE_3__app_config__["a" /* default */]);

/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (routesConfig);

/** @ngInject */
function routesConfig($httpProvider, $stateProvider, $urlRouterProvider) {

  $urlRouterProvider.rule(($i, $location) => {
    const path = $location.path();
    const normalized = path.toLowerCase();
    if (path !== normalized) return normalized;
  });

  $stateProvider.state('overview', {
    url: '/',
    component: 'cmpOverview',
    params: {
      title: 'Overview'
    }
  }).state('results', {
    url: '/results',
    component: 'cmpResults',
    params: {
      title: 'Results'
    }
  });

  $urlRouterProvider.when('', '/');

  $urlRouterProvider.otherwise($injector => {
    const $state = $injector.get('$state');

    $state.go('overview');
  });
}

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (appConfig);

/** @ngInject */
function appConfig($locationProvider) {
  $locationProvider.html5Mode(true);
}

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_bookmarks_bookmarks_service__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__states_overview_overview_component__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__states_results_results_component__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_header_header_component__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_bookmarkForm_bookmarkForm_component__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_bookmarkForm_bookmarkForm_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_bookmarkForm_bookmarkForm_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_bookmarkList_bookmarkList_component__ = __webpack_require__(90);









/* harmony default export */ __webpack_exports__["a"] = (angular.module('common', []).component('cmpOverview', __WEBPACK_IMPORTED_MODULE_1__states_overview_overview_component__["a" /* default */]).component('cmpResults', __WEBPACK_IMPORTED_MODULE_2__states_results_results_component__["a" /* default */]).component('cmpHeader', __WEBPACK_IMPORTED_MODULE_3__components_header_header_component__["a" /* default */]).component('cmpBookmarkForm', __WEBPACK_IMPORTED_MODULE_4__components_bookmarkForm_bookmarkForm_component___default.a).component('cmpBookmarkList', __WEBPACK_IMPORTED_MODULE_5__components_bookmarkList_bookmarkList_component__["a" /* default */]).service('BookmarksService', __WEBPACK_IMPORTED_MODULE_0__services_bookmarks_bookmarks_service__["a" /* default */]));

/***/ }),

/***/ 79:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * The cookies service for various cookie tasks accross the aplication
 */
class BookmarksService {

  /** @ngInject */
  constructor($q, $http) {
    this.$q = $q;
    this.$http = $http;

    this.bookmarks = [];
  }

  addBookmark(bookmark) {}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BookmarksService;


/***/ }),

/***/ 80:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overview_html__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overview_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__overview_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__overview_scss__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__overview_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__overview_scss__);



const bindings = {
  cmpIsStateOpen: '<?'
};

class controller {

  constructor() {
    this.cmpIsStateOpen = !!this.cmpIsStateOpen;
  }

  get componentClasses() {
    return {
      'overview--is-state-open': this.cmpIsStateOpen
    };
  }

  toggleState() {
    this.cmpIsStateOpen = !this.cmpIsStateOpen;
  }

}

/* harmony default export */ __webpack_exports__["a"] = ({ bindings, template: __WEBPACK_IMPORTED_MODULE_0__overview_html___default.a, controller });

/***/ }),

/***/ 81:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"overview\">\n  <cmp-bookmark-form></cmp-bookmark-form>\n  <cmp-bookmark-list></cmp-bookmark-list>\n</div>\n";

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(83);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(21)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./overview.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./overview.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ 84:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const bindings = {};

const transclude = {};

class controller {}

/* harmony default export */ __webpack_exports__["a"] = ({ bindings, controller, transclude });

/***/ }),

/***/ 85:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_html__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__header_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_scss__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__header_scss__);



class controller {
  /** @ngInject */
  constructor($stateParams) {
    this.$stateParams = $stateParams;
  }

  getPageInfo() {
    return {
      title: this.$stateParams.title
    };
  }

  $onInit() {
    this.pageInfo = this.getPageInfo();
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({ controller, template: __WEBPACK_IMPORTED_MODULE_0__header_html___default.a });

/***/ }),

/***/ 86:
/***/ (function(module, exports) {

module.exports = "";

/***/ }),

/***/ 87:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(88);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(21)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./header.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./header.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 88:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ 89:
/***/ (function(module, exports) {



/***/ }),

/***/ 90:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bookmarkList_html__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bookmarkList_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bookmarkList_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bookmarkList_scss__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bookmarkList_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__bookmarkList_scss__);



class controller {
  /** @ngInject */
  constructor(BookmarksService) {
    this.BookmarksService = BookmarksService;
  }

  getPageInfo() {
    return {
      title: this.$stateParams.title
    };
  }

  $onInit() {
    this.bookmarks = this.BookmarksService.bookmarks;
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({ controller, template: __WEBPACK_IMPORTED_MODULE_0__bookmarkList_html___default.a });

/***/ }),

/***/ 91:
/***/ (function(module, exports) {

module.exports = "<div class=\"bookmark-list\">\n  <div class=\"bookmark-list__item\" ng-repeat=\"bookmark in $ctrl.bookmarks\">\n    <cmp-bookmark cmp-data=\"bookmark\"></cmp-bookmark>\n  </div>\n</div>\n";

/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(93);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(21)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./bookmarkList.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./bookmarkList.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(95);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(21)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Inconsolata|Open+Sans+Condensed:300|Source+Sans+Pro);", ""]);

// module
exports.push([module.i, "* {\n  margin: 0px;\n  padding: 0px; }\n\nimg {\n  max-width: 100%;\n  max-height: 100%; }\n\nbody {\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-size: 16px;\n  color: #434343; }\n\na {\n  cursor: pointer;\n  font-family: \"Inconsolata\", monospace;\n  color: #e07304; }\n\nh1, h2, h3 {\n  color: #343434;\n  font-family: \"Inconsolata\", monospace;\n  margin: 0px; }\n\nh1 {\n  font-size: 46px; }\n\nh2 {\n  font-size: 34px; }\n\nh3 {\n  font-size: 22px; }\n\np {\n  margin: 0px; }\n\n* + p {\n  margin-top: 15px; }\n\nbody {\n  background-color: #FFF; }\n", ""]);

// exports


/***/ })

},[50]);