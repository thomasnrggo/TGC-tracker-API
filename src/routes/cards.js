const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cards');

router.post('/users/:userId/cards', cardsController.addCard);
router.get('/users/:userId/cards', cardsController.getUserCards);
router.delete('/users/:userId/cards/:cardId', cardsController.removeCard);

module.exports = router;