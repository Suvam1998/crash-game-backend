const Player = require('../models/Player');
const { getCryptoPrice } = require('../services/cryptoService');

exports.getBalance = async (req, res) => {
  const player = await Player.findById(req.params.playerId);
  const btcPrice = await getCryptoPrice('bitcoin');
  const ethPrice = await getCryptoPrice('ethereum');
  res.json({
    BTC: {
      amount: player.wallets.BTC,
      usd: player.wallets.BTC * btcPrice,
    },
    ETH: {
      amount: player.wallets.ETH,
      usd: player.wallets.ETH * ethPrice,
    },
  });
};