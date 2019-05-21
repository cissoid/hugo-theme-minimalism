/*
 * File Name: pjax.js
 * Author: cissoid
 * Created At: 2019-02-01T14:50:41+0800
 * Last Modified: 2019-02-02T15:03:10+0800
 */
const ANIMATION_END_EVENTS = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oanimationend'];

class Pjax {
  constructor() {
    this.patchLinks(document);
    this.patchPopState();
  }

  patchLinks(element) {
    element.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', (event) => {
        if (event.which > 1 || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
          return;
        }
        if (a.protocol !== window.location.protocol || a.host !== window.location.host) {
          return;
        }
        event.preventDefault();

        this.doRequest(a.href);
      });
    });
  }

  patchPopState() {
    window.addEventListener('popstate', (event) => {
      window.history.replaceState({
        url: location.href,
        scroll: [window.scrollX, window.scrollY]
      }, '', location.href);
      this.doRequest(event.state.url, false).then(() => {
        if ('scroll' in event.state) {
          window.scrollTo(event.state.scroll[0], event.state.scroll[1]);
        }
      });
    });
  }

  doRequest(url, push = true) {
    return Promise.all([fetch(url), this.startLoading()])
      .then(values => {
        const response = values[0];
        if (response.status === 200) {
          return response.text();
        } else {
          throw new Error('response status ' + response.status);
        }
      })
      .then(responseText => {
        const newDocument = new DOMParser().parseFromString(responseText, 'text/html');
        this.patchLinks(newDocument);
        if (push) {
          window.history.pushState({
            url: url
          }, '', url);
          window.scrollTo(0, 0);
        }
        this.replaceElement('title', document, newDocument);
        this.replaceElement('header', document, newDocument);
        this.replaceElement('main', document, newDocument);
        this.replaceElement('footer', document, newDocument);
      })
      .then(() => this.stopLoading());
  }

  replaceElement(selector, oldDocument, newDocument) {
    const oldElement = oldDocument.querySelector(selector);
    const newElement = newDocument.querySelector(selector);
    const parent = oldElement.parentNode;
    parent.insertBefore(newElement, oldElement);
    parent.removeChild(oldElement);
  }

  startLoading() {
    return Promise.all([this.hideElement('header'), this.hideElement('main'), this.hideElement('footer')])
      .then(() => {
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
        })
      });
  }

  stopLoading() {
    return new Promise((resolve, reject) => {
        const mask = document.querySelector('div#mask');
        mask.setAttribute('data-pjax-complete', '');
        mask.style.display = 'none';
        resolve();
      })
      .then(() => {
        return Promise.all([this.showElement('header'), this.showElement('main'), this.showElement('footer')]);
      });
  }

  hideElement(selector) {
    const element = document.querySelector(selector);
    return new Promise((resolve, reject) => {
      element.classList.add('pjax-remove');
      ANIMATION_END_EVENTS.forEach(e => {
        element.addEventListener(e, resolve, true);
      })
    }).then(() => {
      element.style.opacity = 0;
    });
  }

  showElement(selector) {
    const element = document.querySelector(selector);
    return new Promise((resolve, reject) => {
      element.classList.add('pjax-add');
      ANIMATION_END_EVENTS.forEach(e => {
        element.addEventListener(e, resolve, true);
      })
    }).then(() => {
      element.classList.remove('pjax-add');
    });
  }
}

module.exports = Pjax;
