const User = require('../models/user');
const Card = require('../models/card');

exports.addToCollection = async (req, res) => {
    try {
        const { userId } = req.params;
        const cardData = req.body;

        let card = await Card.findOne({ id: cardData.id });
         if (!card) {
            card = new Card(cardData);
            await card.save();
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cardAlreadyAdded = user.cards.some(userCard => userCard.equals(card._id));
        if (cardAlreadyAdded) {
            return res.status(400).json({ message: 'Card already added to collection' });
        }

        const wishlistIndex = user.wishlist.indexOf(card._id);
        if (wishlistIndex > -1) {
            user.wishlist.splice(wishlistIndex, 1);
        }

        user.cards.push(card._id);
        await user.save();

        res.status(201).json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCollection = async (req, res) => {
    try {
        const { userId, cardId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const card = await Card.findOne({ id: cardId });
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const cardIndex = user.cards.findIndex(userCard => userCard.equals(card._id));
        if (cardIndex === -1) {
            return res.status(404).json({ message: 'Card not found in user collection' });
        }

        user.cards.splice(cardIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Card removed from user collection' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addToWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const cardData = req.body;

        let card = await Card.findOne({ id: cardData.id });
        if (!card) {
            card = new Card(cardData);
            await card.save();
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isCardInWishlist = user.wishlist.some(wishlistCard => wishlistCard.equals(card._id));
        if (isCardInWishlist) {
            return res.status(400).json({ message: 'Card already in wishlist' });
        }

        user.wishlist.push(card._id);
        await user.save();

        res.status(200).json({ message: 'Card added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, cardId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(item => item.toString() !== cardId);
        await user.save();
        res.status(200).json({ message: 'Card removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserCards = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('cards');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserCollectionAndWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('cards').populate('wishlist');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            collection: user.cards.map(card => card.id),
            wishlist: user.wishlist.map(card => card.id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};