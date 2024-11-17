const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { addToCart, removeFromCart, getCart } = require('../controllers/cart.controller');
const router = express.Router();

// Protected Route to add product to cart
router.put('/:userId', protect, addToCart);

router.get('/:userId', protect, getCart);


// Protected Route to remove product from cart
router.delete('/:userId', protect, removeFromCart);  // Ensure removeFromCart is passed correctly


module.exports = router;
