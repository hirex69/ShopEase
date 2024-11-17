// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/context/Authcontext';  // Import the AuthProvider
import Home from './pages/customer/Home';
import Header from './pages/customer/Header';
import MainLayout from './Component/Mainlayout';
import Productlist from './Component/Productlist'; // Product list component
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import AdminDashboard from './Component/Admindashboard';
import Cart from './Component/Cart';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <main>
            <Routes>
              {/* All routes will now use MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} /> {/* Home Page */}
                <Route path="admindashboard" element={<AdminDashboard />} />
                <Route path="products" element={<Productlist />} />
                <Route path="login" element={<Login />} />
                <Route path="cart" element={<Cart />} />

                <Route path="register" element={<Register />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
