import React from 'react';
import { Wishlist } from '../common/Wishlist';
import { AccountIcon } from '../common/AccountIcon';
import { CartIcon } from '../common/CartIcon';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { countCartItems } from '../../store/features/cart';
import { countFavouritesItems } from '../../store/favourites/favourites';

const Navigation = ({ variant = "default" }) => {
  const cartLength = useSelector(countCartItems);
  const favouritesLength = useSelector(countFavouritesItems);
  const navigate = useNavigate();

  return (
    <nav className='flex flex-wrap items-center justify-between px-6 py-4 bg-white text-black shadow-lg w-full'>
      {/* Logo */}
      <Link to='/' className='text-3xl font-bold tracking-wide text-black'>Musify</Link>

      {/* Toggle Menu for Mobile */}
      <button className='md:hidden block text-black focus:outline-none'>
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'><path d='M4 6h16M4 12h16m-7 6h7' /></svg>
      </button>

      {/* Navigation Links */}
      {variant === "default" && (
        <ul className='hidden md:flex gap-4 text-lg border-b border-gray-500 pb-2 w-full md:w-auto justify-center md:justify-start'>
          <li className='border-r border-gray-500 pr-4'><NavLink to='/' className={({ isActive }) => isActive ? 'text-[#123456] font-bold' : 'hover:text-gray-500'}>Strona główna</NavLink></li>
          <li className='border-r border-gray-500 pr-4'><NavLink to='/categories/Instrumenty' className={({ isActive }) => isActive ? 'text-[#123456] font-bold' : 'hover:text-gray-500'}>Instrumenty</NavLink></li>
          <li className='border-r border-gray-500 pr-4'><NavLink to='/categories/Studio' className={({ isActive }) => isActive ? 'text-[#123456] font-bold' : 'hover:text-gray-500'}>Studio</NavLink></li>
          <li><NavLink to='/categories/Inne' className={({ isActive }) => isActive ? 'text-[#123456] font-bold' : 'hover:text-gray-500'}>Inne</NavLink></li>
        </ul>
      )}

      {/* Search Bar */}
      {variant === "default" && (
        <div className='relative border border-gray-500 rounded-md w-full md:w-auto'>
          <input type='text' placeholder='Wyszukaj...' className='px-4 py-2 w-full md:w-64 rounded-md text-black focus:ring-2 focus:ring-[#123456]' />
          <button className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700'>
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /></svg>
          </button>
        </div>
      )}

      {/* Icons & Actions */}
      <div className='flex items-center gap-6 border-l border-gray-500 pl-4 w-full md:w-auto justify-center md:justify-start'>
        <button onClick={() => navigate('/wishlist')} className='relative'>
          <Wishlist />
          {favouritesLength > 0 && (
            <span className='absolute -top-2 -right-2 bg-[#123456] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>{favouritesLength}</span>
          )}
        </button>

        <Link to='/cart-items' className='relative flex items-center border-l border-gray-500 pl-4'>
          <CartIcon />
          {cartLength > 0 && (
            <span className='absolute -top-2 -right-2 bg-[#123456] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>{cartLength}</span>
          )}
        </Link>

        <button onClick={() => navigate('/account-details')} className='border-l border-gray-500 pl-4'>
          <AccountIcon />
        </button>

        <button
          onClick={() => navigate('/create-product')}
          className='bg-[#123456] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#0e2a3d] transition border-l border-gray-500 pl-4'
        >
          Wystaw produkt
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
