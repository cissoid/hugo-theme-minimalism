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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n * File Name: index.js\n * Author: cissoid\n * Created At: 2017-04-19T11:07:14+0800\n * Last Modified: 2019-02-01T16:28:22+0800\n */\n__webpack_require__(/*! sass/style.scss */ \"./src/sass/style.scss\");\n\nconst Pjax = __webpack_require__(/*! js/pjax */ \"./src/js/pjax.js\");\n\nwindow.addEventListener('load', () => {\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.register('/service-worker.js');\n  }\n\n  new Pjax();\n});\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ }),

/***/ "./src/js/pjax.js":
/*!************************!*\
  !*** ./src/js/pjax.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n * File Name: pjax.js\n * Author: cissoid\n * Created At: 2019-02-01T14:50:41+0800\n * Last Modified: 2019-02-01T17:54:38+0800\n */\nconst ANIMATION_END_EVENTS = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oanimationend'];\n\nclass Pjax {\n  constructor() {\n    this.patchLinks(document);\n    this.patchPopState();\n  }\n\n  patchLinks(element) {\n    element.querySelectorAll('a[href]').forEach(a => {\n      a.addEventListener('click', event => {\n        if (event.which > 1 || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {\n          return;\n        }\n\n        if (a.protocol !== window.location.protocol || a.host !== window.location.host) {\n          return;\n        }\n\n        event.preventDefault();\n        this.doRequest(a.href);\n      });\n    });\n  }\n\n  patchPopState() {\n    window.addEventListener('popstate', event => {\n      window.history.replaceState({\n        url: location.href,\n        scroll: [window.scrollX, window.scrollY]\n      }, '', location.href);\n      this.doRequest(event.state.url, false).then(() => {\n        if ('scroll' in event.state) {\n          window.scrollTo(event.state.scroll[0], event.state.scroll[1]);\n        }\n      });\n    });\n  }\n\n  doRequest(url, push = true) {\n    return Promise.all([fetch(url), this.startLoading()]).then(values => {\n      const response = values[0];\n\n      if (response.status === 200) {\n        return response.text();\n      } else {\n        throw new Error('response status ' + response.status);\n      }\n    }).then(responseText => {\n      const newDocument = new DOMParser().parseFromString(responseText, 'text/html');\n      this.patchLinks(newDocument);\n\n      if (push) {\n        window.history.pushState({\n          url: url\n        }, '', url);\n        window.scrollTo(0, 0);\n      }\n\n      this.replaceElement('title', document, newDocument);\n      this.replaceElement('main', document, newDocument);\n    }).then(() => this.stopLoading());\n  }\n\n  replaceElement(selector, oldDocument, newDocument) {\n    const oldElement = oldDocument.querySelector(selector);\n    const newElement = newDocument.querySelector(selector);\n    const parent = oldElement.parentNode;\n    parent.insertBefore(newElement, oldElement);\n    parent.removeChild(oldElement);\n  }\n\n  startLoading() {\n    const main = document.querySelector('main');\n    return new Promise((resolve, reject) => {\n      main.classList.add('pjax-remove');\n      ANIMATION_END_EVENTS.forEach(e => {\n        main.addEventListener(e, resolve, true);\n      });\n    }).then(() => {\n      main.style.opacity = 0;\n      return new Promise((resolve, reject) => {\n        const mask = document.querySelector('div#mask');\n        mask.removeAttribute('data-pjax-complete');\n        setTimeout(() => {\n          if (mask.hasAttribute('data-pjax-complete')) {\n            return;\n          }\n\n          mask.style.display = 'block';\n        }, 100);\n        resolve();\n      });\n    });\n  }\n\n  stopLoading() {\n    const main = document.querySelector('main');\n    return new Promise((resolve, reject) => {\n      const mask = document.querySelector('div#mask');\n      mask.setAttribute('data-pjax-complete', '');\n      mask.style.display = 'none';\n      resolve();\n    }).then(() => {\n      return new Promise((resolve, reject) => {\n        main.classList.add('pjax-add');\n        ANIMATION_END_EVENTS.forEach(e => {\n          main.addEventListener(e, resolve, true);\n        });\n      });\n    }).then(() => {\n      main.classList.remove('pjax-add');\n    });\n  }\n\n}\n\nmodule.exports = Pjax;\n\n//# sourceURL=webpack:///./src/js/pjax.js?");

/***/ }),

/***/ "./src/sass/style.scss":
/*!*****************************!*\
  !*** ./src/sass/style.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/sass/style.scss?");

/***/ })

/******/ });