/*
 * File Name: index.js
 * Author: cissoid
 * Created At: 2017-04-19T11:07:14+0800
 * Last Modified: 2019-01-24T16:29:19+0800
 */

require('sass/style.scss');

const Pjax = require('pjax');

window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
  new Pjax({
    selectors: ['title', 'main'],
    cacheBust: false
  });
});
