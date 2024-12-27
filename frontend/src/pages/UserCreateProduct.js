import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProductAPI } from '../api/productAPI'

const UserCreateProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        thumbnail: null,
        condition: 'Nowa',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, thumbnail: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            await createProductAPI(formDataToSend); // Wywołanie metody API
            navigate('/'); // Powrót do strony głównej
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div className="create-product-container">
            <h1 className="text-2xl font-bold mb-4">Wystaw Produkt</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Nazwa produktu:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Opis produktu:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Cena (PLN):</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Kategoria:</label>
                    <input
                        type="text"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Stan produktu:</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full border px-3 py-2"
                    >
                        <option value="Nowa">Nowa</option>
                        <option value="Używana">Używana</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Zdjęcie główne:</label>
                    <input
                        type="file"
                        name="thumbnail"
                        onChange={handleFileChange}
                        required
                        className="w-full border px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Dodaj Produkt
                </button>
            </form>
        </div>
    );
};

export default UserCreateProduct;
