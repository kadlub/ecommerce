import axios from 'axios';
import { API_BASE_URL, API_URLS } from './constant';

// Funkcja do pobierania hierarchicznych kategorii z backendu
export const fetchCategoriesTree = async () => {
    const url = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/tree`; // Endpoint do drzewa kategorii
    try {
        const response = await axios.get(url);
        return response.data; // Oczekiwany format: [{ categoryId, name, subcategories: [...] }]
    } catch (error) {
        console.error('Błąd podczas pobierania drzewa kategorii:', error);
        throw error;
    }
};
