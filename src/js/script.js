{
  function load(year) {
    let number = 0;
    const baseUrl = `https://www.amazon.co.jp/gp/css/order-history?digitalOrders=1&unifiedOrders=1&orderFilter=year-${year}`;

    return fetch(baseUrl, {
      credentials: 'include'
    }).then(response => response.text()).then(html => {
      const promises = [];
      let number = 0;
      let count = Number($(html).find('.num-orders').text().replace('件', ''));
      do {
        promises.push(fetch(`${baseUrl}&startIndex=${number * 10}`, {
          credentials: 'include'
        }).then(response => response.text()).then(html => {
          const orders = [];
          for (const order of $(html).find('div.order')) {
            const $values = $(order).find('div.order-info span.value');
            orders.push({
              date: $values.get(0).textContent.trim(),
              price: Number($values.get(1).textContent.match(/[0-9]/g).join(''))
            });
          }
          return orders;
        }));

        number++;
        count -= 10;
      } while (count > 0);

      return Promise.all(promises);
    });
  }

  const options = document.querySelectorAll('div.top-controls select option');
  const promises = [];
  for (const option of options) {
    let m = /year-(\d\d\d\d)/.exec(option.value);
    if (m) {
      const year = m[1];
      promises.push(load(year).then(data => {
        return {
          data: data,
          year: year
        };
      }));
    }
  }

  const total = {};
  Promise.all(promises).then(results => {
    for (const result of results) {
      total[result.year] = Array.prototype.concat.apply([], result.data);
    }
    return total;
  }).then(() => {
    chrome.runtime.sendMessage(total);
  });
}
