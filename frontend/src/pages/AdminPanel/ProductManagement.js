import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/constant';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/products/all`)
            .then((res) => setProducts(res.data))
            .catch((err) => console.error('Error fetching products:', err));
    }, []);

    const handleDelete = (productId) => {
        axios.delete(`${API_BASE_URL}/api/products/${productId}`)
            .then(() => {
                setProducts((prev) => prev.filter((product) => product.productId !== productId));
            })
            .catch((err) => console.error('Error deleting product:', err));
    };

    const handleEdit = (product) => {
        setEditProduct(product);
    };

    const handleSaveEdit = () => {
        axios.put(`${API_BASE_URL}/api/products/${editProduct.productId}`, editProduct)
            .then(() => {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.productId === editProduct.productId ? editProduct : product
                    )
                );
                setEditProduct(null);
            })
            .catch((err) => console.error('Error editing product:', err));
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td className="border border-gray-300 px-4 py-2">
                                {editProduct?.productId === product.productId ? (
                                    <input
                                        type="text"
                                        value={editProduct.name}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, name: e.target.value })
                                        }
                                        className="border px-2 py-1"
                                    />
                                ) : (
                                    product.name
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editProduct?.productId === product.productId ? (
                                    <input
                                        type="number"
                                        value={editProduct.price}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, price: e.target.value })
                                        }
                                        className="border px-2 py-1"
                                    />
                                ) : (
                                    `$${product.price}`
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editProduct?.productId === product.productId ? (
                                    <button
                                        onClick={handleSaveEdit}
                                        className="text-green-500 hover:underline mr-4"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(product.productId)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;
