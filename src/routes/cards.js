const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cards');

router.post('/:userId', cardsController.addCard);
router.get('/:userId', cardsController.getUserCards);
router.delete('/:userId/:cardId', cardsController.removeCard);

module.exports = router;