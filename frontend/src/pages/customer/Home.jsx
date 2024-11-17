import React from 'react';
import Slideshow from '../../Component/Slideshow';
import Header from './Header';
import './customercss/Home.css';
import ProductCard from '../../Component/ProductCard';
import Productlist from '../../Component/Productlist';

const Home = () => {
  return (
    <div>
      <Header /> 
      
      <div className="main-content">
        <Slideshow />

        <h1>New Arrivals</h1>
        <Productlist/>
      </div>
    </div>
  );
};

export default Home;
