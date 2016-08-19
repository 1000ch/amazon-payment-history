{
  function fetchPage(object) {
    let params = Object.assign({
      digitalOrders: 1,
      unifiedOrders: 1
    }, object);
    let querystring = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

    return fetch(`https://www.amazon.co.jp/gp/css/order-history?${querystring}`, {
      credentials: 'include'
    });
  }

  function load(year) {
    return fetchPage({
      orderFilter: `year-${year}`
    })
    .then(response => response.text())
    .then(html => {
      const promises = [];
      let number = 0;
      let count = Number($(html).find('.num-orders').text().replace('件', ''));

      do {
        promises.push(
          fetchPage({
            orderFilter: `year-${year}`,
            startIndex: `${number * 10}`
          })
          .then(response => response.text())
          .then(html => {
            const orders = [];
            for (const order of $(html).find('div.order')) {
              const $values = $(order).find('div.order-info span.value');
              orders.push({
                date: $values.get(0).textContent.trim(),
                price: Number($values.get(1).textContent.match(/[0-9]/g).join(''))
              });
            }
            return orders;
          })
        );

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

  Promise.all(promises).then(results => {
    const total = {};
    for (const result of results) {
      total[result.year] = Array.prototype.concat.apply([], result.data);
    }
    return total;
  }).then(total => {
    chrome.runtime.sendMessage(total);
  });
}
