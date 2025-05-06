const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/:playerId', walletController.getBalance);

module.exports = router;
