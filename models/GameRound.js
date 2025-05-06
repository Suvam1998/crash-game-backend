const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  crashPoint: Number,
  seed: String,
  hash: String,
  bets: [
    {
      playerId: String,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      cashedOut: Boolean,
      cashoutMultiplier: Number,
    },
  ],
});

module.exports = mongoose.model('GameRound', gameRoundSchema);
