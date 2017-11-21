document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((results, sender, sendResponse) => {
    const loading = document.querySelector('.Loading');
    const container = document.querySelector('.Container');

    loading.classList.add('-hidden');

    let all = 0;
    for (const result of results.sort((a, b) => b.year - a.year)) {
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

    if (all !== 0) {
      div = document.createElement('div');
      div.className = 'Item';
      div.textContent = `年平均: ${Math.round(all / results.length).toLocaleString()}円`;
      container.appendChild(div);

      div = document.createElement('div');
      div.className = 'Item';
      div.textContent = `月平均: ${Math.round(all / (results.length * 12)).toLocaleString()}円`;
      container.appendChild(div);
    }
  });

  chrome.tabs.executeScript({
    file: 'js/jquery-3.1.0.min.js'
  }, () => {
    chrome.tabs.executeScript({
      file: 'js/script.js'
    });
  });
});
