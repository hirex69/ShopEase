const express = require('express');
const { protect, isAdmin } = require('../middleware/auth.middleware');  // Authentication middleware
const upload = require('../multerConfig');  // File upload configuration
const Product = require('../models/product');  // Product model for MongoDB
const router = express.Router();

// Route for fetching all products (accessible to everyone, including customers)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Admin only: Route to upload new product
router.post('/products/upload', protect, isAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { title, description, price } = req.body;
  const imagePath = req.file.path;

  try {
    const newProduct = new Product({
      title,
      description,
      price,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Admin only: Route to delete product
router.delete('/products/:id', protect, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID and delete it
    const product = await Product.findByIdAndDelete(id);  // Using findByIdAndDelete
    
    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optionally: If you have images and want to delete the associated image file from the server
    // const fs = require('fs');
    // fs.unlinkSync(product.image);  // Uncomment if you want to delete image file

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    // Log and return the error details
    console.error('Error deleting product:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});
module.exports = router;
