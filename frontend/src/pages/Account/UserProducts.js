import React, { useEffect, useState } from "react";
import { fetchUserProductsAPI } from "../../api/userInfo";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setLoading(true));
            try {
                const data = await fetchUserProductsAPI();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching user products:", error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-2xl mb-4">My Products</h1>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.productId}
                            className="border rounded-lg shadow-lg p-4"
                        >
                            <img
                                src={product.imageUrl || "/default-product.png"}
                                alt={product.name}
                                className="h-48 w-full object-cover rounded-md"
                            />
                            <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                            <p className="text-gray-500">Price: ${product.price}</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {product.isSold ? "Sold" : "Available"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProducts;
