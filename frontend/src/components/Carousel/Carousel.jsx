import React, { useState, useEffect } from 'react';

// Import your images
import Img1 from '../../assets/img/carousel1.png';
import Img2 from '../../assets/img/carousel2.png';
import Img3 from '../../assets/img/carousel3.png';

const Carousel = () => {
  const images = [Img1, Img2, Img3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set up an interval to change the image every 10 seconds
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // 10000ms = 10 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div
      className='relative flex items-center bg-cover bg-center text-left h-screen w-full transition-all duration-1000'
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className='absolute inset-0 bg-black opacity-40'></div>
      <main className='relative px-10 lg:px-24 z-10'>
        <p className='mt-3 text-white sm:mt-5 sm:max-w-xl text-6xl'>
          Wszystko dla Tych, <br />
          Którzy Żyją Muzyką
        </p>
        <button className='border rounded mt-6 border-black hover:bg-white hover:text-black hover:border-black text-white bg-black w-44 h-12'>
          Dołącz do nas!
        </button>
      </main>
    </div>
  );
};

export default Carousel;
