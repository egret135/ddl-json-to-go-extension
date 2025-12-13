// Background Service Worker
// Handles extension icon click to open the app in a new tab

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html')
    });
});
