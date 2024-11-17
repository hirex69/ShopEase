import React from 'react';
import './customercss/Home.css'; // Optional: Create a separate CSS file for the header
import { useAuth } from '../../context/Authcontext'; // Import the useAuth hook

const Header = () => {
  const { user, logout } = useAuth();  // Access user state and logout function from context

  return (
    <header className="header">
      <div className="logo">
        <h1>ShopEase</h1>
        <h6>Men's Choice</h6>
      </div>
      
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/cart">Cart</a></li>

          {/* Conditionally render based on whether the user is logged in */}
          {user ? (
            <>
              <li><button onClick={logout}>Logout</button></li> {/* Logout button */}
            </>
          ) : (
            <>
              <li><a href="/register">Register</a></li>
            </>
          )}

          {/* Show Admin link only if the user is an admin */}
          {user && user.role === 'admin' && (
            <li><a href="/Admindashboard">Admin</a></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
