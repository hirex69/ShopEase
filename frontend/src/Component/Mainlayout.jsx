// src/components/MainLayout.js
import React from 'react';
import Home from '../pages/customer/Home';  // Home page component
import { Outlet } from 'react-router-dom';  // Renders nested routes
import Header from '../pages/customer/Header';

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Home component will appear at the top */}
      <Header />
      
      {/* This will render the child routes below Home */}
        <Outlet />
      </div>
  );
};

export default MainLayout;
