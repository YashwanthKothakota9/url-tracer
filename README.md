## 4 places where extension functionality is placed

### Popups

Mobile view of your extension. Viewport is limited 800px by 600px.

### Extension Pages

Desktop view of your extension.You can access these extension pages through URLs like:

```
chrome-extension://{YOUR_EXTENSION_ID}/{page}.html
```

Your extension will have a unique ID that belongs to it and allows you to reference these pages.

### Content Scripts

Content scripts are what make browser extensions powerful. Content scripts are scripts that can be embedded into a tab.They have permissions to access the extension APIs to interact with the browser and higher level tools (dev tools, screenshots, browser storage, etc.) BUT they also have access to the DOM (page data, elements, etc.). This means you can communicate from your extension to the content script and interact with page elements. You can add a button that adds additional functionality, compute data that’s not computed, or gather feedback.You will have to add permissions to your manifest when adding content scripts.

### Background Scripts

Think of background scripts as the “API” to your extension.Use background scripts for registering alarms (timed processes), managing state, facilitating communication, injecting content scripts through code (good for dynamically injected content scripts), adding context menus (right click) or pretty much any “always on” type of function or communication.Background scripts are always headless so you won’t use any of the frontend tools you might use elsewhere.

```js
"icons": {
    "16": "/images/icons/icon-16x16.png",
    "32": "/images/icons/icon-32x32.png",
    "48": "/images/icons/icon-48x48.png",
    "128": "/images/icons/icon-128x128.png"
  },
```

When passing a message from any part of your extension to any other part of your extension, you pass an object.

This target key is the part of the extension should listen for this message. I also pass an action key which is what method should be run. Then any data I pass along with the message is passed with the data key.

Example:

```js
await browser.runtime.sendMessage({
  target: 'BACKGROUND',
  action: 'ANNOUNCE_USER',
  data: {
    name: 'Dan',
  },
});
```

Here’s the base level targets I use:

- BACKGROUND - Any message sent to the background service worker script.
- POPUP - Any message sent to the popup script.
- CONTENT - Any message sent to the content script.
- PAGE - Any message sent to the extension’s page

```js
"content_scripts": [
{
"matches": ["<all_urls>"],
"js": ["content/index.js"]
}
],
```
