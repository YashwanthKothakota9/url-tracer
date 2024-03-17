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
