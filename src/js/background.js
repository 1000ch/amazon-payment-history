function openPopup(tabId) {
  chrome.browserAction.setPopup({
    tabId: tabId,
    popup: './html/popup.html'
  });
}

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.getAllInWindow(undefined, tabs => {
    for (const tab of tabs) {
      if (tab.url && tab.url.includes('https://www.amazon.co.jp/gp/css/order-history')) {
        chrome.tabs.update(tab.id, {
          active: true
        }, tab => openPopup(tab.id));
        return;
      }
    }

    chrome.tabs.create({
      url: 'https://www.amazon.co.jp/gp/css/order-history',
      active: true
    }, tab => openPopup(tab.id));
  });
});
