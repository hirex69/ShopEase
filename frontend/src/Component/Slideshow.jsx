// src/components/Slideshow.js
import React, { useState, useEffect } from 'react';
import './CSS/Slideshow.css'; // Create the CSS for the slideshow

const Slideshow = () => {
  // Array of image URLs for the slideshow
  const images = [
    // These should be paths to your images in the public directory or imports
    'https://i.pinimg.com/736x/b3/74/21/b374218190f8c91d0dac55ad643d046c.jpg',
'https://img.freepik.com/premium-vector/special-summer-weekend-offers-fashionable-dress-mega-sale-offer-web-banner-thumbnail_673898-488.jpg?semt=ais_hybrid',
'https://img.freepik.com/free-psd/banner-urban-fashion-template_23-2148652497.jpg',  ];

  // State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to move to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Set up an interval to automatically move to the next image every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 4000); // 3 seconds for each image
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <div className="slideshow-container">
      <img src={images[currentIndex]} alt="Slideshow" className="slideshow-image" />
    </div>
  );
};

export default Slideshow;
