import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProductAPI } from '../api/productAPI';
import { fetchCategoriesTree } from '../api/fetchCategories';
import { getSellerIdFromToken } from '../api/authUtils'; // Import the utility function

const UserCreateProduct = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('Nowa');
    const [categoryId, setCategoryId] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const categoryList = await fetchCategoriesTree();
                setCategories(categoryList);
            } catch (err) {
                console.error('Błąd podczas ładowania kategorii:', err);
                setError('Nie udało się załadować kategorii. Spróbuj ponownie później.');
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    const handleFileChange = (e) => {
        setImageFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const sellerId = getSellerIdFromToken();
            console.log("Seller ID:", sellerId); // Debugowanie wartości
            if (!sellerId || typeof sellerId !== 'string') {
                setError("Niepoprawny sellerId. Upewnij się, że jesteś zalogowany.");
                return;
            }

            const formData = new FormData();

            // Dodaj dane produktu
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", parseFloat(price).toString()); // Upewnij się, że to string
            formData.append("categoryId", categoryId);
            formData.append("condition", condition);
            formData.append("sellerId", sellerId); // Upewnij się, że sellerId jest stringiem

            // Dodaj obrazy
            for (let i = 0; i < imageFiles.length; i++) {
                formData.append("images", imageFiles[i]);
            }

            // Wywołaj API
            console.log("FormData:", formData);
            await createProductAPI(formData);

            navigate("/"); // Po sukcesie
        } catch (err) {
            console.error("Błąd podczas tworzenia produktu:", err.message);
            setError("Wystąpił błąd podczas dodawania produktu. Spróbuj ponownie.");
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Wystaw produkt</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nazwa produktu
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Cena
                    </label>
                    <input
                        type="number"
                        id="price"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Opis
                    </label>
                    <textarea
                        id="description"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                        Stan
                    </label>
                    <select
                        id="condition"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        required
                    >
                        <option value="Nowa">Nowa</option>
                        <option value="Używana">Używana</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Kategoria
                    </label>
                    {loadingCategories ? (
                        <p>Ładowanie kategorii...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <select
                            id="category"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Wybierz kategorię</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                        Zdjęcia
                    </label>
                    <input
                        type="file"
                        id="images"
                        className="mt-1 block w-full"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    Dodaj produkt
                </button>
            </form>
        </div>
    );
};

export default UserCreateProduct;
