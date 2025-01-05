import React, { useEffect, useState } from "react";
import { fetchUserProductsAPI } from "../../api/userInfo";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import ProductCard from "../ProductListPage/ProductCard";

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchUserProductsAPI()
            .then((res) => {
                setProducts(res);
            })
            .catch((err) => {
                console.error("Error fetching user products:", err);
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, [dispatch]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">My Products</h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.productId}
                            productId={product.productId}
                            title={product.name}
                            description={product.description}
                            price={product.price}
                            discount={product.discount ?? 0} // Dodaj pole zniżki, jeśli istnieje
                            rating={product.rating ?? null} // Dodaj ocenę, jeśli istnieje
                            brand={product.brand ?? "No brand"} // Dodaj markę, jeśli istnieje
                            imageUrls={product.imageUrls} // Lista zdjęć
                            slug={product.slug} // Dodaj slug
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">You have not listed any products yet.</p>
            )}
        </div>
    );
};

export default UserProducts;
