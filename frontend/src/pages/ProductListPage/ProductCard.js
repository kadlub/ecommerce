import React from 'react';
import SvgFavourite from '../../components/common/SvgFavourite';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCartAction } from '../../store/actions/cartAction';
import { addItemToFavouritesAction, removeItemFromFavouritesAction } from '../../store/favourites/favouritesAction';
import { selectFavouritesItems } from '../../store/favourites/favourites';
import { CartIcon } from '../../components/common/CartIcon';
import { Wishlist } from '../../components/common/Wishlist';
import { API_BASE_URL } from '../../api/constant';

const ProductCard = ({ productId, title, description, price, discount, rating, brand, imageUrls, slug }) => {
  const dispatch = useDispatch();
  const favourites = useSelector(selectFavouritesItems);
  const imageBaseUrl = `${API_BASE_URL}/api/uploads/products/`;

  const thumbnail = imageUrls?.length > 0 ? `${imageBaseUrl}${imageUrls[0]}` : '/placeholder-image.png';

  const handleAddToCart = () => {
    const discountedPrice = discount ? price - price * (discount / 100) : price;
    const product = {
      productId,
      name: title,
      price: discountedPrice,
      thumbnail,
      quantity: 1,
      subTotal: discountedPrice,
    };
    dispatch(addItemToCartAction(product));
  };

  const isFavourite = favourites.some((item) => item.productId === productId);

  const toggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeItemFromFavouritesAction({ productId }));
    } else {
      const favouriteProduct = {
        productId,
        name: title,
        price,
        thumbnail,
        slug,
      };
      dispatch(addItemToFavouritesAction(favouriteProduct));
    }
  };

  return (
    <div className="flex flex-col hover:scale-105 relative border border-black rounded-lg shadow-lg p-4">
      <Link to={`/products/${slug}`}>
        <img
          className="h-[320px] w-[280px] border rounded-lg cursor-pointer object-contain"
          src={thumbnail}
          alt={title}
        />
      </Link>

      <div className="flex flex-col mt-4">
        <p className="text-[16px] font-semibold max-w-[380px] break-words">{title}</p>
        {discount ? (
          <div>
            <p className="text-red-500 line-through text-sm">{price}zł</p>
            <p className="text-green-500 font-bold">{(price - price * (discount / 100)).toFixed(2)}zł</p>
          </div>
        ) : (
          <p className="text-lg font-bold">{price} zł</p>
        )}
      </div>

      {description && <p className="text-[12px] text-gray-600 mt-2">{brand}</p>}

      <div className="absolute top-0 right-0 pt-4 pr-4 flex flex-col space-y-2">
        <button
          onClick={handleAddToCart}
          className="cursor-pointer text-gray-500 hover:text-gray-800"
        >
          <CartIcon />
        </button>
        <button
          onClick={toggleFavourite}
          className="cursor-pointer text-gray-500 hover:text-gray-800"
        >
          <Wishlist />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
