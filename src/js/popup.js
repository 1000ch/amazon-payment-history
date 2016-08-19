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
    const container = document.querySelector('.Container');
    let all = 0;
    Object.keys(data).forEach(year => {
      let item = document.createElement('div');
      let y = document.createElement('div');
      let p = document.createElement('div');

      let total = 0;
      data[year].forEach(i => total += i.price);
      all += total;

      item.className = 'Item';
      y.textContent = `${year}年`;
      y.className = 'Item__Year';
      p.textContent = `${total}円`;
      p.className = 'Item__Price';

      item.appendChild(y);
      item.appendChild(p);
      container.appendChild(item);
    });

    const item = document.createElement('div');
    const t = document.createElement('div');
    const y = document.createElement('div');
    item.className = 'Item';
    t.textContent = '合計';
    t.className = 'Item__Year';
    y.textContent = `${all}円`;
    y.className = 'Item__Price';
    item.appendChild(t);
    item.appendChild(y);
    container.appendChild(item);
  });

  chrome.tabs.executeScript({
    file: 'js/jquery-3.1.0.min.js'
  }, () => {
    chrome.tabs.executeScript({
      file: 'js/script.js'
    });
  });
});
