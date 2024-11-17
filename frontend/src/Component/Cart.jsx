import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import './CSS/Cart.css'; // Ensure the CSS is correctly imported

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);  // Track processing state
  const [paymentSuccess, setPaymentSuccess] = useState(false);  // State for payment success popup

  // Fetch the user's cart data when the component mounts
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:5000/api/cart/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Assuming response.data is the cart object with items array
          setCart(response.data.items); // Set the cart items to state
          console.log(response.data); // Check the response structure in console
        } catch (error) {
          console.error('Error fetching cart:', error.response ? error.response.data : error.message);
        }
      };

      fetchCart();
    }
  }, [user]);

  // Handle remove product from cart
  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
  
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/${user.id}`,
        { data: { productId } }, // Send the productId in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(response.data); // Check the response after deletion
  
      // Update the cart state to reflect the removal
      setCart(cart.filter(item => item.productId && item.productId._id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error.response ? error.response.data : error.message);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  // Simulate fake payment gateway
  const handleCompletePayment = () => {
    setIsProcessing(true);  // Disable button during payment process

    // Simulate payment process with a 3-second delay
    setTimeout(() => {
      setIsProcessing(false);  // Enable the button after payment completes
      setPaymentSuccess(true);  // Show the success message
    }, 3000);
  };

  // Close payment success popup
  const closePaymentSuccess = () => setPaymentSuccess(false);

  // Render the cart items
  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <ul>
          {cart.map(item => (
            item.productId ? (
              <li key={item.productId._id} className="cart-item">
                <img
                  // Safely check if image exists
                  src={item.productId.image ? `http://localhost:5000/${item.productId.image}` : '/path/to/default-image.jpg'}
                  alt={item.productId.title || 'Product Image'}
                  width="100"
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.productId.title || 'Product Title'}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.productId.price || 'N/A'}</p>
                  <button onClick={() => handleRemove(item.productId._id)}>Remove</button>
                </div>
              </li>
            ) : (
              <li key={item._id} className="cart-item">
                <p>Product data is missing or incomplete.</p>
              </li>
            )
          ))}
        </ul>
      ) : (
        <p>No items in the cart.</p>
      )}

      {/* Display Total Price */}
      <div className="cart-total">
        <h3>Total Price: ${calculateTotal().toFixed(2)}</h3>
        <button onClick={handleCompletePayment} disabled={isProcessing}>
          {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
        </button>
      </div>

      {/* Payment Success Popup */}
      {paymentSuccess && (
        <div className="payment-success-popup">
          <div className="popup-content">
            <h2>Payment Successful!</h2>
            <p>Your order has been successfully placed.</p>
            <button onClick={closePaymentSuccess}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
