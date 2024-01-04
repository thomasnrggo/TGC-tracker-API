const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    id: String,
    name: String,
    supertype: String,
    subtypes: [String],
    hp: String,
    types: [String],
    evolvesFrom: String,
    abilities: [{
        name: String,
        text: String,
        type: String
    }],
    attacks: [{
        name: String,
        cost: [String],
        convertedEnergyCost: Number,
        damage: String,
        text: String
    }],
    weaknesses: [{
        type: String,
        value: String
    }],
    retreatCost: [String],
    convertedRetreatCost: Number,
    set: {
        id: String,
        name: String,
        series: String,
        printedTotal: Number,
        total: Number,
        legalities: {
            unlimited: String,
            standard: String,
            expanded: String
        },
        ptcgoCode: String,
        releaseDate: String,
        updatedAt: String,
        images: {
            symbol: String,
            logo: String
        }
    },
    number: String,
    artist: String,
    rarity: String,
    flavorText: String,
    nationalPokedexNumbers: [Number],
    legalities: {
        unlimited: String,
        standard: String,
        expanded: String
    },
    images: {
        small: String,
        large: String
    },
    tcgplayer: {
        url: String,
        updatedAt: String,
        prices: {
            normal: {
                low: Number,
                mid: Number,
                high: Number,
                market: Number,
                directLow: Number
            },
            reverseHolofoil: {
                low: Number,
                mid: Number,
                high: Number,
                market: Number,
                directLow: Number
            }
        }
    },
    cardmarket: {
        url: String,
        updatedAt: String,
        prices: {
            averageSellPrice: Number,
            lowPrice: Number,
            trendPrice: Number,
            germanProLow: Number,
            suggestedPrice: Number,
            reverseHoloSell: Number,
            reverseHoloLow: Number,
            reverseHoloTrend: Number,
            lowPriceExPlus: Number,
            avg1: Number,
            avg7: Number,
            avg30: Number,
            reverseHoloAvg1: Number,
            reverseHoloAvg7: Number,
            reverseHoloAvg30: Number
        }
    }
});

module.exports = mongoose.model('Card', cardSchema);