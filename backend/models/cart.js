// models/Cart.js
const mongoose = require('mongoose');

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, // This links to the Product _id
    ref: 'Product', // Reference the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

// Define the cart schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
    required: true,
  },
  items: [cartItemSchema], // An array of cart items
});

module.exports = mongoose.model('Cart', cartSchema);
