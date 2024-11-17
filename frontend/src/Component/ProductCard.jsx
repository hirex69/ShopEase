import React, { useState, useEffect } from 'react';
import './CSS/ProductCard.css';
import LoginModal from './LoginModal';
import { useAuth } from '../context/Authcontext';  // Import useAuth
import axios from 'axios';

const ProductCard = ({ product }) => {
  const { user, cart = [], updateCartData } = useAuth();
  const [isInCart, setIsInCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Added state for processing flag
  const [quantity, setQuantity] = useState(1); // State to store selected quantity

  // Update cart state when user or cart changes
  useEffect(() => {
    if (user) {
      const isProductInCart = Array.isArray(cart) && cart.some(item => item._id === product._id);
      setIsInCart(isProductInCart);
    }
  }, [cart, user, product._id]);

  // Handle Add to Cart button click
  const handleAddToCart = async () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
  
    const productId = product._id;
    const selectedQuantity = quantity; // Use the selected quantity
  
    console.log("Sending productId:", productId, "and quantity:", selectedQuantity); // Log the correct data
  
    try {
      setIsProcessing(true); // Disable button to prevent multiple clicks
  
      const response = await axios.put(
        `http://localhost:5000/api/cart/${user.id}`,
        { productId, quantity: selectedQuantity },  // Send selected quantity
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setIsInCart(true);
      updateCartData(user.id, [...cart, product]);  // Update cart data in context
  
      setIsProcessing(false); // Enable the button after request completes
    } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
      setIsProcessing(false); // Enable button in case of error
    }
  };

  // Handle Remove from Cart button click
  const handleRemoveFromCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/${user.id}`,
        { data: { productId: product._id } },  // Send only productId for removal
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log(response.data);
      setIsInCart(false);
      updateCartData(user.id, cart.filter(item => item._id !== product._id));  // Update local cart state
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value, 10)); // Ensure quantity is at least 1
    setQuantity(newQuantity);
  };

  const closeModal = () => setIsModalOpen(false);
  console.log(product);


  return (
    <div className="product-card">
      < img src={product.image ? `http://localhost:5000/${product.image}` : '/path/to/default-image.jpg'}
      alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <div className="product-price">
        <span>${product.price}</span>

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity: </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            onChange={handleQuantityChange} // Handle quantity change
          />
        </div>

        {isInCart ? (
          <button onClick={handleRemoveFromCart}>Remove from Cart</button>
        ) : (
          <button onClick={handleAddToCart} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Add to Cart'}
          </button>
        )}
      </div>

      {isModalOpen && <LoginModal onClose={closeModal} />}
    </div>
  );
};

export default ProductCard;
