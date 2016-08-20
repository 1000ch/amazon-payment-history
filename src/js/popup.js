document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((results, sender, sendResponse) => {
    const share = document.querySelector('.Share');
    const loading = document.querySelector('.Loading');
    const container = document.querySelector('.Container');

    loading.classList.add('-hidden');

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

    const url = 'https://chrome.google.com/webstore/detail/pgccjlmicdpgkbllgiafapgbnciodipb';
    const text = `Amazonで使ったお金は${results.length}年間で${all.toLocaleString()}円です！`;
    share.href = `https://twitter.com/share?url=${url}&text=${encodeURIComponent(text)}`;
    share.classList.remove('-hidden');
  });

  chrome.tabs.executeScript({
    file: 'js/jquery-3.1.0.min.js'
  }, () => {
    chrome.tabs.executeScript({
      file: 'js/script.js'
    });
  });
});
