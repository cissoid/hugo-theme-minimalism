/*
 * File Name: index.js
 * Author: cissoid
 * Created At: 2017-04-19T11:07:14+0800
 * Last Modified: 2019-01-25T11:52:53+0800
 */

require('sass/style.scss');

const Pjax = require('pjax');

window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
  new Pjax({
    selectors: ['title', 'main'],
    switches: {
      // 'title': Pjax.switches.sideBySide,
      'main': function(oldEl, newEl, options, switchOptions) {
        var _this = this;
        const animationEndEvents = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oanimationend'];
        new Promise(function(resolve, reject) {
          oldEl.classList.add('out');
          animationEndEvents.forEach(function(e) {
            oldEl.addEventListener(e, resolve, true);
          })
        }).then(function() {
          const parent = oldEl.parentNode;
          newEl.hide = true;
          parent.insertBefore(newEl, oldEl);
          parent.removeChild(oldEl);
          return new Promise(function(resolve, reject) {
            newEl.classList.add('in');
            animationEndEvents.forEach(function(e) {
              newEl.addEventListener(e, resolve, true);
            })
          });
        }).then(function() {
          newEl.classList.remove('in');
          _this.onSwitch();
        });
      }
    },
    cacheBust: false
  });
});
