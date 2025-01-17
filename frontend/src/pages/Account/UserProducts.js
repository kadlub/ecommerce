import React, { useEffect, useState } from "react";
import { fetchUserProductsAPI } from "../../api/userInfo";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import EditProductForm from "../ProductListPage/EditProductForm";
import { deleteProductAPI } from "../../api/productAPI";
import { API_BASE_URL } from "../../api/constant";

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null); // Id produktu z otwartym menu
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
            <h2 className="text-2xl font-bold mb-4"></h2>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.productId}
                            className="border rounded-lg shadow-lg p-4 flex flex-col items-center relative"
                        >
                            {/* Trzy kropki w prawym górnym rogu */}
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => setMenuOpen(menuOpen === product.productId ? null : product.productId)}
                                    className="text-gray-600 hover:text-black focus:outline-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6h.01M12 12h.01M12 18h.01"
                                        />
                                    </svg>
                                </button>
                                {/* Menu dropdown */}
                                {menuOpen === product.productId && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Edytuj
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.productId)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                )}
                            </div>

                            <img
                                className="h-[200px] w-[200px] border rounded-lg object-contain"
                                src={`${API_BASE_URL}/api/uploads/products/${product.imageUrls[0]}`}
                                alt={product.name}
                            />
                            <div className="mt-4 w-full">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-500 text-sm">{product.description}</p>
                                <p className="text-lg font-bold mt-2">{product.price} zł</p>
                                <p
                                    className={`text-sm mt-2 ${product.sold ? "text-red-500 font-bold" : "text-green-500"
                                        }`}
                                >
                                    {product.sold ? "Sprzedany" : "Dostępny"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 text-lg">
                    Brak wystawionych ofert. Wystaw swój pierwszy produkt!
                </div>
            )}

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
