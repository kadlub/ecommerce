import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/constant';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/categories`)
            .then((response) => setCategories(response.data))
            .catch((error) => console.error('Błąd podczas pobierania kategorii:', error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`${API_BASE_URL}/api/categories/${id}`)
            .then(() => setCategories(categories.filter(category => category.id !== id)))
            .catch((error) => console.error('Błąd podczas usuwania kategorii:', error));
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;

        axios.post(`${API_BASE_URL}/api/categories`, { name: newCategory })
            .then((response) => setCategories((prev) => [...prev, response.data]))
            .catch((error) => console.error('Błąd podczas dodawania kategorii:', error))
            .finally(() => setNewCategory(''));
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Zarządzanie kategoriami</h2>
            <div className="mb-4 flex">
                <input
                    type="text"
                    className="border px-4 py-2 mr-4 w-1/2"
                    placeholder="Nowa kategoria"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleAddCategory}
                >
                    Dodaj
                </button>
            </div>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nazwa</th>
                        <th className="border px-4 py-2">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="border px-4 py-2">{category.name}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDelete(category.id)}
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryManagement;
