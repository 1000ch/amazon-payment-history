document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    const dl = document.querySelector('dl');
    let all = 0;
    Object.keys(data).forEach(year => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');

      let total = 0;
      data[year].forEach(item => total += item.price);
      all += total;

      dt.textContent = `${year}年`;
      dd.textContent = `${total}円`;
      dl.appendChild(dt);
      dl.appendChild(dd);
    });

    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = '合計';
    dd.textContent = `${all}円`;
    dl.appendChild(dt);
    dl.appendChild(dd);
  });

  chrome.tabs.executeScript({
    file: 'js/jquery-3.1.0.min.js'
  }, () => {
    chrome.tabs.executeScript({
      file: 'js/script.js'
    });
  });
});
