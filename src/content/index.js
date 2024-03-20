global.browser = require('webextension-polyfill');

function notifyBackgroundPage() {
  // Send a message to the background script with the current URL
  browser.runtime.sendMessage({
    type: 'URL_CHANGE',
    url: window.location.href,
  });
}

// Listen for page loads
window.addEventListener('load', notifyBackgroundPage);

// Listen for URL changes, for example, in single-page applications (SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    notifyBackgroundPage();
  }
}).observe(document, { subtree: true, childList: true });
