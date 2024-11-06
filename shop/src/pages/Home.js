import React from 'react';
import ProductList from '../components/ProductList';

const Home = () => (
    <main>
        <h1>Welcome to Music Shop</h1>
        <ProductList category="featured" />
    </main>
);

export default Home;
