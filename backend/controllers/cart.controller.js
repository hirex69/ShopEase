const Cart = require('../models/cart');
const Product = require('../models/product');

// Add to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.params.userId;

  console.log('Received userId:', userId); // Log once here

  // Validation: Ensure both productId and quantity are present
  if (!productId || !quantity) {
    return res.status(400).json({ message: 'ProductId and quantity are required' });
  }

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If no cart exists for the user, create one
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
      await cart.save();
      return res.json(cart);  // Return the newly created cart
    }

    // If cart exists, check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex > -1) {
      // Update the existing product's quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      cart.items.push({ productId, quantity });
    }

    await cart.save();  // Save the updated cart
    return res.json(cart);  // Return the updated cart
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Error adding product to cart' });
  }
};



exports.removeFromCart = async (req, res) => {
  const { userId } = req.params;  // Get userId from URL parameter
  const { productId } = req.body;  // Get productId from request body

  // Validation: Ensure productId is provided
  if (!productId) {
    return res.status(400).json({ message: 'productId is required' });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove product from cart
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // If the cart is empty after the removal, consider deleting the cart
    if (cart.items.length === 0) {
      await cart.remove();  // Remove the cart from the database
      return res.status(200).json({ message: 'Cart is empty. Cart removed.' });
    }

    await cart.save();
    return res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (err) {
    console.error('Error removing product from cart:', err);
    return res.status(500).json({ message: 'Error removing product from cart', error: err.message });
  }
};
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user's cart and populate the items.productId field
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    return res.status(200).json(cart); // Return the populated cart
  } catch (error) {
    console.error('Error fetching cart:', error); // Log the error
    return res.status(500).json({ message: 'Server error while fetching cart.' });
  }
};