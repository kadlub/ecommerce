// src/pages/CartPage.js

import React from 'react';

const CartPage = () => {
    const cartItems = [
        { id: 1, name: "Electric Guitar", price: "3000 zł", quantity: 1 },
        { id: 2, name: "Guitar Strings", price: "50 zł", quantity: 2 },
    ];

    const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);

    return (
        <main className="cart-page">
            <h1>Your Cart</h1>
            {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                    <h2>{item.name}</h2>
                    <p>{item.price} x {item.quantity}</p>
                </div>
            ))}
            <hr />
            <h2>Total: {total} zł</h2>
            <button>Proceed to Checkout</button>
        </main>
    );
};

export default CartPage;
