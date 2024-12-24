import React, { useEffect, useState } from 'react';
import HeroSection from './components/Carousel/Carousel';
import NewArrivals from './components/Sections/NewArrivals';
import Category from './components/Sections/Categories/Category';
import Footer from './components/Footer/Footer';
import { fetchCategoriesTree } from './api/fetchCategories'; // Użycie nowego endpointu

const Shop = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategoriesTree();
        setCategories(response); // Oczekujemy danych w formacie drzewa
      } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      <HeroSection />
      <NewArrivals />
      {categories.map((category) => (
        <Category
          key={category.categoryId}
          name={category.name}
          subcategories={category.subcategories} // Zagnieżdżone podkategorie
        />
      ))}
      <Footer content={{ copyright: '© 2024 YourCompany' }} />
    </>
  );
};

export default Shop;
