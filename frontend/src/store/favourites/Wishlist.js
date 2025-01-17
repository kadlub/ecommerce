import React from 'react';
import { useSelector } from 'react-redux';
import { selectFavouritesItems } from './favourites';
import ProductCard from '../../pages/ProductListPage/ProductCard';
import { API_BASE_URL } from '../../api/constant';

const Wishlist = () => {
    const favourites = useSelector(selectFavouritesItems);
    const imageBaseUrl = `${API_BASE_URL}/api/uploads/products/`;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Moje ulubione produkty</h1>
            {favourites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favourites.map((product) => (
                        <ProductCard
                            key={product.productId}
                            productId={product.productId}
                            title={product.name}
                            description={product.description || ''}
                            price={product.price}
                            discount={product.discount || 0}
                            rating={product.rating || 0}
                            brand={product.brand || 'Unknown'}
                            imageUrls={[product.thumbnail.replace(imageBaseUrl, '')]} // Konwertujemy thumbnail na imageUrls
                            slug={product.slug}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-lg">Nie masz jeszcze ulubionych produktów.</p>
            )}
        </div>
    );
};

export default Wishlist;
