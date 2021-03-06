{
  const concat = Array.prototype.concat;
  const currentYear = new Date().getFullYear();

  function fetchOrderHistoryPage(params) {
    const keys = Object.keys(params);
    const querystring = keys.map(key => `${key}=${params[key]}`).join('&');

    return fetch(`https://www.amazon.co.jp/gp/css/order-history?${querystring}`, {
      credentials: 'include'
    }).then(response => response.text());
  }

  function loadPaymentData(year) {
    return new Promise(resolve => {
      chrome.storage.local.get(`amazon-payment-history-${year}`, items => {
        resolve(items[`amazon-payment-history-${year}`]);
      });
    });
  }

  function savePaymentData(year, data) {
    return new Promise(resolve => {
      const saveData = {};
      saveData[`amazon-payment-history-${year}`] = data;
      chrome.storage.local.set(saveData, () => resolve(data))
    });
  }

  function getPaymentData(year) {
    return fetchOrderHistoryPage({
      digitalOrders: 1,
      unifiedOrders: 1,
      orderFilter: `year-${year}`
    }).then(html => {
      const promises = [];
      let number = 0;
      let count = Number($(html).find('.num-orders').text().replace('件', ''));

      do {
        promises.push(
          fetchOrderHistoryPage({
            digitalOrders: 1,
            unifiedOrders: 1,
            orderFilter: `year-${year}`,
            startIndex: `${number * 10}`
          }).then(html => {
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

      return Promise.all(promises).then(data => {
        return {
          year: year,
          data: concat.apply([], data)
        };
      });
    });
  }

  const options = document.querySelectorAll('form.time-period-chooser select option');
  const promises = [];
  for (const option of options) {
    let m = /year-(\d\d\d\d)/.exec(option.value);
    if (m) {
      const year = Number(m[1]);
      if (year === currentYear) {
        promises.push(getPaymentData(year));
      } else {
        promises.push(loadPaymentData(year).then(result => {
          return result || getPaymentData(year).then(data => savePaymentData(year, data));
        }));
      }
    }
  }

  Promise.all(promises).then(results => {
    chrome.runtime.sendMessage(results);
  });
}
