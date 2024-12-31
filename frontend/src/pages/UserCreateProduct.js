import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProductAPI } from '../api/productAPI';
import { fetchCategoriesTree } from '../api/fetchCategories';

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

    const [categories, setCategories] = useState([]); // Stan dla kategorii
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        // Pobierz kategorie przy montowaniu komponentu
        const loadCategories = async () => {
            try {
                const categoryTree = await fetchCategoriesTree();
                setCategories(categoryTree);
            } catch (error) {
                console.error('Błąd podczas ładowania kategorii:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

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

    const renderCategoryOptions = (categories) => {
        return categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
                {category.name}
            </option>
        ));
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
                    {loadingCategories ? (
                        <p>Ładowanie kategorii...</p>
                    ) : (
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2"
                        >
                            <option value="">Wybierz kategorię</option>
                            {renderCategoryOptions(categories)}
                        </select>
                    )}
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
