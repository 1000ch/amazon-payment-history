document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.getAllInWindow(undefined, tabs => {
    for (const tab of tabs) {
      if (tab.url && tab.url.includes('https://www.amazon.co.jp/gp/css/order-history')) {
        chrome.tabs.update(tab.id, {selected: true});
        return;
      }
    }

    chrome.tabs.create({url: 'https://www.amazon.co.jp/gp/css/order-history'});
  });

  chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    const loading = document.querySelector('.Loading');
    const container = document.querySelector('.Container');

    loading.classList.add('-hidden');

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

  chrome.tabs.executeScript({
    file: 'js/jquery-3.1.0.min.js'
  }, () => {
    chrome.tabs.executeScript({
      file: 'js/script.js'
    });
  });
});
