import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';  // Correct import

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);  // State for user's cart

  // Fetch user data on component mount if a token is found
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);  // Decode the JWT token
        setUser(decoded);  // Store the decoded user data in state
        getCartData(decoded.id); // Fetch the user's cart data from the server
      } catch (error) {
        console.error('Error decoding token:', error);  // Catch token decoding errors
      }
    }
  }, []);

  // Function to fetch user's cart data from server
  const getCartData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCart(response.data.cart);  // Set the fetched cart
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  // Function to update cart data on the server
  const updateCartData = async (userId, newCart) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/${userId}`, 
        { cart: newCart },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCart(newCart);  // Update the local cart state
    } catch (error) {
      console.error('Error updating cart data:', error);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwt_decode(token);  // Decode the JWT token
        setUser(decoded);
        getCartData(decoded.id);  // Fetch the user's cart data after login
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Registration function
  const register = async (username, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwt_decode(token);
        setUser(decoded);
        getCartData(decoded.id);  // Fetch user's cart data after registration
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);  // Clear cart on logout
  };
  

  return (
    <AuthContext.Provider value={{ user, cart, login, register, logout, updateCartData }}>
      {children}
    </AuthContext.Provider>
  );
};
