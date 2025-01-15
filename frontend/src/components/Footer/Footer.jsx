import React from 'react';
import FbIcon from '../common/FbIcon';
import InstaIcon from '../common/InstaIcon';

// Obiekt content definiujący dane do stopki
const content = {
  items: [
    {
      title: 'Informacje',
      list: [
        { label: 'O nas', path: '/about' },
        { label: 'Kontakt', path: '/contact' },
      ],
    },
    {
      title: 'Pomoc',
      list: [
        { label: 'FAQ', path: '/faq' },
        { label: 'Wsparcie', path: '/support' },
      ],
    },
  ],
  copyright: '© 2025 Musify', // Nazwa sklepu z rokiem
};

// Komponent Footer
const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      {/* Sekcja linków */}
      <div className="flex justify-around">
        {content?.items?.map((item, index) => (
          <div className="flex flex-col" key={index}>
            <p className="text-lg font-bold pb-2">{item?.title}</p>
            {item?.list?.map((listItem, idx) => (
              <a
                className="text-sm text-gray-300 py-1 hover:underline"
                href={listItem?.path}
                key={idx}
              >
                {listItem?.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Sekcja ikon mediów społecznościowych */}
      <div className="flex gap-4 items-center justify-center py-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FbIcon />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <InstaIcon />
        </a>
      </div>

      {/* Sekcja regulaminu */}
      <div className="text-center">
        <a href="/terms" className="text-sm text-gray-300 underline py-2 block">
          Regulamin
        </a>
      </div>

      {/* Sekcja praw autorskich */}
      <p className="text-sm text-center text-gray-400 mt-4">
        {content?.copyright || `© ${new Date().getFullYear()} Nazwa Sklepu`}
      </p>
    </footer>
  );
};

export default Footer;
