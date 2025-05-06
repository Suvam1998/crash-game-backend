const gameEngine = require('../services/gameEngine');

module.exports = (io) => {
  gameEngine.startNewRound(io);

  io.on('connection', (socket) => {
    socket.on('bet', ({ playerId, usdAmount, cryptoAmount, currency }) => {
      gameEngine.placeBet(playerId, usdAmount, cryptoAmount, currency);
    });

    socket.on('cashout', ({ playerId, multiplier }) => {
      gameEngine.cashOut(playerId, multiplier, io);
    });
  });
};
