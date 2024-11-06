// src/pages/Checkout.js

import React from 'react';

const Checkout = () => (
    <main className="checkout-page">
        <h1>Order Confirmation</h1>
        <p>Thank you for your purchase! Your order will be processed shortly.</p>

        <section className="checkout-summary">
            <h2>Order Summary</h2>
            <p>Electric Guitar - 3000 zł</p>
            <p>Shipping - 20 zł</p>
            <hr />
            <h2>Total: 3020 zł</h2>
        </section>
    </main>
);

export default Checkout;
