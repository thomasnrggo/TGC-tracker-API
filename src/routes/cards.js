const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cards');

router.post('/:userId', cardsController.addToCollection);
router.get('/:userId', cardsController.getUserCards);
router.delete('/:userId/:cardId', cardsController.removeFromCollection);
router.post('/:userId/wishlist', cardsController.addToWishlist);
router.delete('/:userId/wishlist/:cardId', cardsController.removeFromWishlist);
router.get('/:userId/list', cardsController.getUserCollectionAndWishlist);

module.exports = router;