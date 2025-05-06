const crypto = require('crypto');

function generateCrashPoint(seed, round) {
  const hash = crypto.createHash('sha256').update(seed + round).digest('hex');
  const intVal = parseInt(hash.substring(0, 8), 16);
  const crash = (intVal % 10000) / 100 + 1;
  return { crashPoint: crash.toFixed(2), hash };
}

module.exports = { generateCrashPoint };
