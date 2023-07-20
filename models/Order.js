const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    items: [{type: Schema.Types.ObjectId, ref: "Item"}],
    owner: {type: Schema.Types.ObjectId, ref: "User"}
  });

module.exports = model('Order', orderSchema);