// src/pages/ProductDetail.js

import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const product = {
        id,
        name: "Electric Guitar",
        description: "High-quality electric guitar with excellent sound.",
        price: "3000 zł",
        image: "placeholder.jpg",
    };

    return (
        <main className="product-detail">
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "auto", borderRadius: "8px" }} />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h2>{product.price}</h2>
            <button>Add to Cart</button>
        </main>
    );
};

export default ProductDetail;
