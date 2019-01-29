/*
 * File Name: index.js
 * Author: cissoid
 * Created At: 2017-04-19T11:07:14+0800
 * Last Modified: 2019-01-29T16:28:46+0800
 */

require('sass/style.scss');

const Pjax = require('pjax');

function showLoading() {
  return new Promise((resolve, reject) => {
    const mask = document.querySelector('div#mask');
    mask.removeAttribute('data-pjax-complete');
    setTimeout(() => {
      if (mask.hasAttribute('data-pjax-complete')) {
        return;
      }
      mask.style.display = 'block';

      const main = document.querySelector('main');
      main.style.opacity = 0.5;
    }, 100);

    resolve();
  });
}

function hideLoading() {
  return new Promise((resolve, reject) => {
    const mask = document.querySelector('div#mask');
    mask.setAttribute('data-pjax-complete', '');
    mask.style.display = 'none';

    resolve();
  });
}

window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }

  Pjax.prototype.doRequest = function(location, options, callback) {
    options = options || {};
    const requestOptions = options.requestOptions || {};
    const requestMethod = (requestOptions.requestMethod || "GET").toUpperCase();
    const requestParams = requestOptions.requestParams || null;
    const formData = requestOptions.formData || null;
    const timeout = options.timeout || 0;
    let queryString;
    let requestPayload = null;
    let requestHeaders = {};

    if (requestParams && requestParams.length) {
      queryString = (requestParams.map(function(param) {
        return param.name + "=" + param.value
      })).join("&")

      switch (requestMethod) {
        case "GET":
          location = location.split("?")[0];
          location += "?" + queryString;
          break
        case "POST":
          requestPayload = queryString;
          break
      }
    } else if (formData) {
      requestPayload = formData;
    }
    requestHeaders['X-Requested-With'] = 'fetch';
    requestHeaders['X-PJAX'] = 'true';
    requestHeaders['x-PJAX-Selectors'] = JSON.stringify(options.selectors);
    if (requestPayload && requestMethod === "POST" && !formData) {
      requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    const reqPromise = fetch(location, {
      method: requestMethod,
      headers: requestHeaders,
      body: requestPayload
    }).then(function(response) {
      if (response.status == 200) {
        return response.text();
      } else {
        throw new Error('response status ' + response.status);
      }
    });
    Promise.all([reqPromise, showLoading()]).then(values => {
      const text = values[0];
      const fakeRequest = {
        responseURL: location
      };
      callback(text, fakeRequest, location, options);
    }).catch(function(error) {
      callback(null, null, location, options);
    });
  };

  new Pjax({
    selectors: ['title', 'main'],
    switches: {
      // 'title': Pjax.switches.sideBySide,
      'main': function(oldEl, newEl, options, switchOptions) {
        const _this = this;
        const animationEndEvents = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oanimationend'];
        hideLoading().then(() => {
          return new Promise(function(resolve, reject) {
            oldEl.classList.add('out');
            animationEndEvents.forEach(function(e) {
              oldEl.addEventListener(e, resolve, true);
            })
          }).then(function() {
            const parent = oldEl.parentNode;
            newEl.hide = true;
            parent.insertBefore(newEl, oldEl);
            parent.removeChild(oldEl);
            _this.onSwitch();
            return new Promise(function(resolve, reject) {
              newEl.classList.add('in');
              animationEndEvents.forEach(function(e) {
                newEl.addEventListener(e, resolve, true);
              })
            });
          }).then(function() {
            newEl.classList.remove('in');
          });
        })
      }
    },
    cacheBust: false
  });
});
