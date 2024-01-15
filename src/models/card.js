const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  id: String,
  name: String,
  supertype: String,
  number: String,
  artist: String,
  rarity: String,
  images: {
    small: String,
    large: String,
  },
})

module.exports = mongoose.model('Card', cardSchema)
