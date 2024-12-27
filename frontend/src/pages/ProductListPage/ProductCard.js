import React from 'react';
import SvgFavourite from '../../components/common/SvgFavourite';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCartAction } from '../../store/actions/cartAction';

const ProductCard = ({ id, title, description, price, discount, rating, brand, thumbnail, slug }) => {
  const dispatch = useDispatch();

  // Funkcja obsługująca dodawanie do koszyka
  const handleAddToCart = () => {
    const discountedPrice = discount ? price - price * (discount / 100) : price; // Obliczanie ceny po rabacie
    const product = {
      productId: id,
      name: title,
      price: discountedPrice,
      thumbnail,
      quantity: 1,
      subTotal: discountedPrice, // Cena dla 1 sztuki z uwzględnieniem rabatu
    };
    dispatch(addItemToCartAction(product));
  };

  return (
    <div className="flex flex-col hover:scale-105 relative border rounded-lg shadow-lg p-4">
      {/* Obraz produktu */}
      <Link to={`/products/${slug}`}>
        <img
          className="h-[320px] w-[280px] border rounded-lg cursor-pointer object-cover block"
          src={thumbnail}
          alt={title}
        />
      </Link>

      {/* Szczegóły produktu */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-col">
          <p className="text-[16px] font-semibold">{title}</p>
          {description && <p className="text-[12px] text-gray-600">{brand}</p>}
        </div>
        <div>
          {/* Cena z uwzględnieniem rabatu */}
          {discount ? (
            <div>
              <p className="text-red-500 line-through text-sm">${price}</p>
              <p className="text-green-500 font-bold">${(price - price * (discount / 100)).toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-lg font-bold">${price}</p>
          )}
        </div>
      </div>

      {/* Sekcja ocen */}
      <div className="flex items-center mt-2">
        {rating ? (
          <p className="text-yellow-500 text-sm">{'⭐'.repeat(Math.round(rating))}</p>
        ) : (
          <p className="text-gray-400 text-sm">Brak ocen</p>
        )}
      </div>

      {/* Przyciski akcji */}
      <div className="absolute top-0 right-0 pt-4 pr-4 flex space-x-2">
        {/* Dodaj do koszyka */}
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white py-1 px-4 rounded-lg text-sm hover:bg-blue-600"
        >
          Dodaj do koszyka
        </button>
        {/* Dodaj do ulubionych */}
        <button
          onClick={() => console.log('Dodano do ulubionych')}
          className="cursor-pointer text-gray-500 hover:text-gray-800"
        >
          <SvgFavourite />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
