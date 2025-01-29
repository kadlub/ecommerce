import React, { useState } from "react";
import { updateProductAPI } from "../../api/productAPI"; // Funkcja do aktualizacji produktu
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";

const EditProductForm = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        categoryId: product?.categoryId || "",
        condition: product?.condition || "",
    });

    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            await updateProductAPI(product.productId, formData);
            alert("Product updated successfully!");
            onClose();
        } catch (err) {
            console.error("Error updating product:", err);
            alert("Failed to update the product.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-lg relative">
                <h2 className="text-xl font-bold mb-4">Edytuj produkt</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nazwa</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border rounded-lg px-4 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Opis</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="border rounded-lg px-4 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cena</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="border rounded-lg px-4 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Stan</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="border rounded-lg px-4 py-2 w-full"
                            required
                        >
                            <option value="">Stan</option>
                            <option value="Nowy">Nowy</option>
                            <option value="Używany">Używany</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        >
                            Zapisz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;