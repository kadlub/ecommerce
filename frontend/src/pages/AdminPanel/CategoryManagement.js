import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/constant';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);

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

    return (
        <div>
            <h2 className="text-2xl mb-4">Zarządzanie kategoriami</h2>
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
