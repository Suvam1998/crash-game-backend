// services/gameEngine.js

const { generateCrashPoint } = require('./crashAlgorithm');
const GameRound = require('../models/GameRound');
const Player = require('../models/Player');
const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('uuid');

let currentRound = null;
let activeBets = new Map(); // key: playerId, value: { usdAmount, cryptoAmount, currency }

let roundNumber = 1;

const startNewRound = async (io) => {
  const seed = 'static_seed';
  const { crashPoint, hash } = generateCrashPoint(seed, roundNumber);
  let multiplier = 1.0;

  currentRound = {
    roundNumber,
    crashPoint: parseFloat(crashPoint),
    hash,
    seed,
    bets: [],
  };

  io.emit('roundStart', {
    roundNumber,
    hash,
  });

  const interval = setInterval(async () => {
    multiplier += 0.05;
    io.emit('multiplier', multiplier.toFixed(2));

    // Handle crash
    if (multiplier >= currentRound.crashPoint) {
      io.emit('crash', currentRound.crashPoint);

      // Finalize round and update database
      await finalizeRound(multiplier);
      clearInterval(interval);

      roundNumber++;
      activeBets.clear();

      setTimeout(() => startNewRound(io), 2000); // wait 2s before new round
    }
  }, 100);
};

const placeBet = (playerId, usdAmount, cryptoAmount, currency) => {
  activeBets.set(playerId, { usdAmount, cryptoAmount, currency, cashedOut: false });
  currentRound.bets.push({
    playerId,
    usdAmount,
    cryptoAmount,
    currency,
    cashedOut: false,
    cashoutMultiplier: null,
  });
};

const cashOut = async (playerId, multiplier, io) => {
  const bet = activeBets.get(playerId);
  if (!bet || bet.cashedOut) return;

  const gain = bet.cryptoAmount * multiplier;

  const player = await Player.findById(playerId);
  player.wallets[bet.currency] += gain;
  await player.save();

  const tx = new Transaction({
    playerId,
    usdAmount: gain * (await require('./cryptoService').getCryptoPrice(bet.currency)),
    cryptoAmount: gain,
    currency: bet.currency,
    transactionType: 'cashout',
    transactionHash: uuidv4(),
    priceAtTime: await require('./cryptoService').getCryptoPrice(bet.currency),
  });
  await tx.save();

  // Mark as cashed out in currentRound
  const entry = currentRound.bets.find(b => b.playerId === playerId && !b.cashedOut);
  if (entry) {
    entry.cashedOut = true;
    entry.cashoutMultiplier = multiplier;
  }

  bet.cashedOut = true;
  io.emit('playerCashout', { playerId, multiplier });
};

const finalizeRound = async (multiplier) => {
  const game = new GameRound({
    ...currentRound,
  });
  await game.save();
};

module.exports = {
  startNewRound,
  placeBet,
  cashOut,
};
