/*
 * File Name: index.js
 * Author: cissoid
 * Created At: 2017-04-19T11:07:14+0800
 * Last Modified: 2019-05-22T09:44:36+0800
 */

require('sass/style.scss');

const Pjax = require('js/pjax');

function vhTrick() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
  new Pjax();
  vhTrick();
});

window.addEventListener('resize', vhTrick);
