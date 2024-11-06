// src/pages/SellProduct.js

import React, { useState } from 'react';

const SellProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Product listed:", product);
        // Send data to backend
    };

    return (
        <main className="sell-product-form">
            <h1>List a Product for Sale</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Product Name:
                    <input type="text" name="name" onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <textarea name="description" onChange={handleChange} required />
                </label>
                <label>
                    Category:
                    <select name="category" onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="instrument">Instrument</option>
                        <option value="accessory">Accessory</option>
                        <option value="album">Album</option>
                    </select>
                </label>
                <label>
                    Price:
                    <input type="number" name="price" onChange={handleChange} required />
                </label>
                <button type="submit">List Product</button>
            </form>
        </main>
    );
};

export default SellProduct;
