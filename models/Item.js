const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
    name: String,
    description: String,
    imageUrl: String,
    price: String
  });

module.exports = model('Item', itemSchema);