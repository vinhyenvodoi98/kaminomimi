const axios = require('axios');
const fs = require('fs');
const main = async () => {
  var dataCheck = [];
  const { data } = await axios.get(
    // call 10 element per page
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
  );
  data.forEach((d) => {
    dataCheck.push({ value: d.name, tag: d.symbol });
    dataCheck.push({ value: d.symbol, tag: d.symbol });
  });
  fs.writeFileSync('./constant/checkList.json', JSON.stringify(dataCheck, null, 2), 'utf8');
};

main();
