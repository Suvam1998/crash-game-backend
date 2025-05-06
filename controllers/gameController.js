const { getCryptoPrice } = require('../services/cryptoService');
const Player = require('../models/Player');
const GameRound = require('../models/GameRound');
const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('uuid');

exports.placeBet = async (req, res) => {
  try {
    const { playerId, usdAmount, currency } = req.body;
    const price = await getCryptoPrice(currency);
    const cryptoAmount = usdAmount / price;
    const player = await Player.findById(playerId);
    if (player.wallets[currency] < cryptoAmount) return res.status(400).send('Insufficient funds');
    player.wallets[currency] -= cryptoAmount;
    await player.save();
    const tx = new Transaction({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: uuidv4(),
      priceAtTime: price,
    });
    await tx.save();
    res.json({ cryptoAmount });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.cashOut = async (req, res) => {
  res.send('Cashout logic here');
};
