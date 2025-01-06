import React, { useEffect, useState } from "react";
import { fetchUserProductsAPI } from "../../api/userInfo";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import UserProductCard from "../ProductListPage/UserProductCard";
import EditProductForm from "../ProductListPage/EditProductForm";
import { deleteProductAPI } from "../../api/productAPI";

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const dispatch = useDispatch();

    const fetchUserProducts = async () => {
        dispatch(setLoading(true));
        try {
            const response = await fetchUserProductsAPI();
            setProducts(response);
        } catch (err) {
            console.error("Error fetching user products:", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(setLoading(true));
            try {
                await deleteProductAPI(productId);
                setProducts((prev) => prev.filter((product) => product.productId !== productId));
                alert("Product deleted successfully!");
            } catch (err) {
                console.error("Error deleting product:", err);
                alert("Failed to delete the product.");
            } finally {
                dispatch(setLoading(false));
            }
        }
    };

    useEffect(() => {
        fetchUserProducts();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div
                        key={product.productId}
                        className="border rounded-lg shadow-lg p-4 flex flex-col items-center relative"
                    >
                        <img
                            className="h-[200px] w-[200px] border rounded-lg object-contain"
                            src={`http://localhost:8080/api/uploads/products/${product.imageUrls[0]}`}
                            alt={product.name}
                        />
                        <div className="mt-4 w-full">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-500 text-sm">{product.description}</p>
                            <p className="text-lg font-bold mt-2">${product.price}</p>
                            <p
                                className={`text-sm mt-2 ${product.sold ? "text-red-500 font-bold" : "text-green-500"
                                    }`}
                            >
                                {product.sold ? "Sold" : "Available"}
                            </p>
                        </div>
                        <div className="mt-4 flex gap-4">
                            <button
                                className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600"
                                onClick={() => setEditingProduct(product)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                                onClick={() => handleDeleteProduct(product.productId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onClose={() => {
                        setEditingProduct(null);
                        fetchUserProducts(); // Refresh the list after editing
                    }}
                />
            )}
        </div>
    );
};

export default UserProducts;