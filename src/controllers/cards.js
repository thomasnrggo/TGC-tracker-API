const User = require('../models/user');
const Card = require('../models/card');

exports.addCard = async (req, res) => {
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

        user.cards.push(card);
        await user.save();

        res.status(201).json(card);
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

exports.removeCard = async (req, res) => {
    try {
        const { userId, cardId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cardIndex = user.cards.findIndex(card => card.toString() === cardId);
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