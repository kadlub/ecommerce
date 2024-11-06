import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <header>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/sell">Sell</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/cart">Cart</Link>
        </nav>
    </header>
);

export default Header;
