import React, { useEffect, useState } from 'react';
import HeroSection from './components/Carousel/Carousel';
import Bestsellers from './components/Sections/Bestsellers';
import Footer from './components/Footer/Footer';
import { fetchCategoriesTree } from './api/fetchCategories';

const Shop = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategoriesTree();
        setCategories(response);
      } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      <HeroSection />
      <Bestsellers />
      <Footer content={{ copyright: '© 2024 YourCompany' }} />
    </>
  );
};

export default Shop;
