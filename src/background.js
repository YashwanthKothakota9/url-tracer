import { onMessage, sendMessage } from 'webext-bridge/background';

let browser = require('webextension-polyfill');

onMessage('RETURN_STATS', announceAction);
async function announceAction({ data }) {
  console.log('AnnounceAction');
  if (data.from === 'Popup') {
    const response = await browser.storage.local.get(['urlVisitTimes']);
    console.log('From BAckground:', response);
    return { message: response.urlVisitTimes };
  }
}

function extractDomain(url) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split('.').reverse();
  if (parts.length >= 3) {
    if (parts[1].length <= 3) {
      return parts[2] + '.' + parts[1] + '.' + parts[0];
    }
    return parts[1] + '.' + parts[0];
  } else if (parts.length === 2) {
    return parts[1] + '.' + parts[0];
  }
  return hostname;
}

let activeTabId = null;
let startTime = Date.now();

// Update the time spent on the current tab
function updateTimeOnTab(tabId) {
  console.log('UpdateTimeOnTab');
  if (activeTabId !== null) {
    const endTime = Date.now();
    const timeSpent = endTime - startTime;

    browser.tabs.get(activeTabId).then((tab) => {
      if (
        !tab.url ||
        tab.url.startsWith('chrome://newtab') ||
        tab.url.startsWith('about:newtab') ||
        tab.url.startsWith('chrome://extensions') ||
        tab.url.startsWith('chrome://')
      ) {
        console.log('Skipping tracking for', tab.url);
        return; // Exit the function early
      }
      //const url = new URL(tab.url).hostname; // You might want to store the full URL or just the hostname
      const domainName = extractDomain(tab.url);
      const faviconUrl = tab.favIconUrl || '';
      // Fetch the current data, update it, and store it again
      browser.storage.local.get(['urlVisitTimes']).then((result) => {
        const currentData = result.urlVisitTimes || {};
        console.log('CurrentData Get:', currentData);

        // Update the time for the current URL
        const domainData = currentData[domainName] || {
          timeSpent: 0,
          favicon: faviconUrl,
        };
        domainData.timeSpent += timeSpent;
        domainData.favicon = faviconUrl;

        currentData[domainName] = domainData;

        // Save the updated data back in local storage
        browser.storage.local.set({ urlVisitTimes: currentData }).then(() => {
          console.log('Updated data for', domainName, currentData[domainName]);
          console.log('currentData:', currentData);
          sendMessage('statsUpdated', { updated: true }, 'popup');
        });
      });
    });
  }
  // Prepare for the next tab
  startTime = Date.now();
  activeTabId = tabId;
}

// Call startTracking on extension install/update and also immediately for browser startup
// browser.runtime.onInstalled.addListener(async (details) => {
//   await browser.storage.local.clear();
//   startTracking(); // Start tracking immediately after installation/update
// });

// startTracking(); // Also start tracking immediately when the background script runs, e.g., at browser startup

browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  if (tabs[0]) {
    activeTabId = tabs[0].id;
    startTime = Date.now(); // Reset the start time to now
    updateTimeOnTab(activeTabId); // Start tracking this tab immediately
  }
});

browser.tabs.onActivated.addListener((activeInfo) => {
  console.log('OnActivated');
  updateTimeOnTab(activeInfo.tabId);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('OnUpdated');
  if (tab.active && changeInfo.url) {
    updateTimeOnTab(tabId);
  }
});

browser.windows.onFocusChanged.addListener((windowId) => {
  console.log('OnFocusChanged');
  if (windowId === browser.windows.WINDOW_ID_NONE) {
    updateTimeOnTab(null);
  } else {
    browser.tabs.query({ active: true, windowId: windowId }).then((tabs) => {
      if (tabs[0]) {
        updateTimeOnTab(tabs[0].id);
      }
    });
  }
});

// Your existing webNavigation.onHistoryStateUpdated listener
// Listen for history state updates, common in SPAs
browser.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    console.log('History state updated in tab:', details.tabId);
    // Perform similar logic to what you do in tabs.onUpdated
    // You may want to filter by `details.frameId === 0` to only consider top-level navigation changes

    if (details.frameId === 0) {
      // Check if it's the main frame
      // Mimic what you do in your updateTimeOnTab function, adapted for this context
      // Since we don't have the tab object directly, we use tabs.get to fetch it
      browser.tabs
        .get(details.tabId)
        .then((tab) => {
          if (tab.active) {
            // Double-check if the tab is still active
            UpdateTimeOnTab(details.tabId);
          }
        })
        .catch((error) => console.error('Error fetching tab:', error));
    }
  },
  {
    url: [
      { hostSuffix: '.com' },
      { hostSuffix: '.net' },
      { hostSuffix: '.org' },
    ],
  }
);

browser.action.onClicked.addListener((tab) => {
  console.log('Inside clicked:');
  activeTabId = tab.id; // Set the activeTabId to the current tab
  updateTimeOnTab(tab.id); // Update the time on the current tab
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'URL_CHANGE') {
    console.log('URL Changed to:', message.url);
    // An additional handler could be added here if needed
    if (sender.tab) {
      let tabId = sender.tab.id;
      updateTimeOnTab(tabId);
    }
  }
});
