import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProductAPI } from '../api/productAPI';
import { fetchCategoriesTree } from '../api/fetchCategories';

const UserCreateProduct = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        images: [],
        condition: 'Nowa',
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
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
        setFormData({ ...formData, images: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') {
                    value.forEach((file) => {
                        formDataToSend.append('images', file);
                    });
                } else {
                    formDataToSend.append(key, value);
                }
            });
            await createProductAPI(formDataToSend);
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

    if (loadingCategories) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-lg bg-white p-6 rounded shadow">
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
                    </div>
                    <div>
                        <label className="block text-gray-700">Stan produktu:</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="w-full border px-3 py-2"
                        >
                            <option value="Nowa">Nowy</option>
                            <option value="Używana">Używany</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Zdjęcia produktu:</label>
                        <input
                            type="file"
                            name="images"
                            onChange={handleFileChange}
                            multiple
                            required
                            className="w-full border px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white py-2 px-4 rounded-lg shadow-md"
                        style={{ backgroundColor: '#123456' }}
                    >
                        Dodaj Produkt
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserCreateProduct;
