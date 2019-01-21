/*
 * File Name: index.js
 * Author: cissoid
 * Created At: 2017-04-19T11:07:14+0800
 * Last Modified: 2019-01-21T16:55:12+0800
 */

require('sass/style.scss');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
