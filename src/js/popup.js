document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((results, sender, sendResponse) => {
    document.querySelector('.Loading').classList.add('-hidden');
    const container = document.querySelector('.Container');

    let all = 0;
    for (const result of results) {
      let total = 0;
      result.data.forEach(i => total += i.price);
      all += total;

      let div = document.createElement('div');
      div.className = 'Item';
      div.textContent = `${result.year}年: ${total.toLocaleString()}円`;
      container.appendChild(div);
    }

    let div = document.createElement('div');
    div.className = 'Item';
    div.textContent = `合計: ${all.toLocaleString()}円`;
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
