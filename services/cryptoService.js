const axios = require('axios');
const { setCache, getCache } = require('../utils/cache');

async function getCryptoPrice(crypto) {
  const cachedPrice = getCache(crypto);
  if (cachedPrice) return cachedPrice;

  const res = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
  );
  const price = res.data[crypto].usd;

  setCache(crypto, price, 10000); // 10 seconds TTL
  return price;
}

module.exports = { getCryptoPrice };
