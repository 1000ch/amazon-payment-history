document.addEventListener('DOMContentLoaded', () => {
  function executeScript() {
    chrome.tabs.executeScript({
      file: 'js/jquery-3.1.0.min.js'
    }, () => {
      chrome.tabs.executeScript({
        file: 'js/script.js'
      });
    });
  }

  chrome.tabs.getAllInWindow(undefined, tabs => {
    for (const tab of tabs) {
      if (tab.url && tab.url.includes('https://www.amazon.co.jp/gp/css/order-history')) {
        chrome.tabs.update(tab.id, {
          active: true
        }, tab => executeScript());
        return;
      }
    }

    chrome.tabs.create({
      url: 'https://www.amazon.co.jp/gp/css/order-history',
      active: true
    }, tab => executeScript());
  });

  chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    document.querySelector('.Loading').classList.add('-hidden');
    const container = document.querySelector('.Container');

    let all = 0;
    Object.keys(data).forEach(year => {
      let total = 0;
      data[year].forEach(i => total += i.price);
      all += total;

      let div = document.createElement('div');
      div.className = 'Item';
      div.textContent = `${year}年: ${total}円`;
      container.appendChild(div);
    });

    let div = document.createElement('div');
    div.className = 'Item';
    div.textContent = `合計: ${all}円`;
    container.appendChild(div);
  });
});
