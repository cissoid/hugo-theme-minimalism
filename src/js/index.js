/*
 * File Name: index.js
 * Author: cissoid
 * Created At: 2017-04-19T11:07:14+0800
 * Last Modified: 2019-01-30T14:56:21+0800
 */

require('sass/style.scss');

const Pjax = require('pjax');

const ANIMATION_END_EVENTS = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oanimationend'];

function showLoading() {
  const main = document.querySelector('main');
  return new Promise((resolve, reject) => {
    main.classList.add('pjax-remove');
    ANIMATION_END_EVENTS.forEach(e => {
      main.addEventListener(e, resolve, true);
    })
  }).then(() => {
    main.style.opacity = 0;
    return new Promise((resolve, reject) => {
      const mask = document.querySelector('div#mask');
      mask.removeAttribute('data-pjax-complete');
      setTimeout(() => {
        if (mask.hasAttribute('data-pjax-complete')) {
          return;
        }
        mask.style.display = 'block';
      }, 100);

      resolve();
    });
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

window.addEventListener('load', () => {
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
      queryString = (requestParams.map(param => param.name + "=" + param.value)).join("&")

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
    }).then(response => {
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
    }).catch(error => {
      callback(null, null, location, options);
    });
  };

  new Pjax({
    selectors: ['title', 'main'],
    switches: {
      // 'title': Pjax.switches.sideBySide,
      'main': function(oldEl, newEl, options, switchOptions) {
        const parent = oldEl.parentNode;
        parent.insertBefore(newEl, oldEl);
        parent.removeChild(oldEl);
        this.onSwitch();

        hideLoading().then(() => {
          return new Promise((resolve, reject) => {
            newEl.classList.add('pjax-add');
            ANIMATION_END_EVENTS.forEach(e => {
              newEl.addEventListener(e, resolve, true);
            })
          });
        }).then(() => {
          newEl.classList.remove('pjax-add');
        });
      }
    },
    cacheBust: false
  });
});
