// src/components/ProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => (
    <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.price} zł</p>
        <Link to={`/product/${product.id}`}>
            <button>View Details</button>
        </Link>
    </div>
);

export default ProductCard;
