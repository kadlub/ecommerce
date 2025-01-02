import axios from 'axios';
import { API_BASE_URL, API_URLS, getHeaders } from './constant';

// Funkcja do pobierania hierarchicznych kategorii z backendu
export const fetchCategoriesTree = async () => {
    const url = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/tree`;
    try {
        const response = await axios.get(url);

        // Jeśli kategorie są zagnieżdżone, możesz je spłaszczyć:
        const flattenCategories = (categories) => {
            return categories.reduce((acc, category) => {
                acc.push({ categoryId: category.categoryId, name: category.name });
                if (category.subcategories) {
                    acc = acc.concat(flattenCategories(category.subcategories));
                }
                return acc;
            }, []);
        };

        return flattenCategories(response.data);
    } catch (error) {
        console.error('Błąd podczas pobierania drzewa kategorii:', error);
        throw error;
    }
};

// Funkcja do pobierania podkategorii dla danej kategorii głównej
export const getSubcategoriesByCategoryName = async (categoryName) => {
    const url = `${API_BASE_URL}/api/categories/by-name/${encodeURIComponent(categoryName)}/subcategories`;
    try {
        const response = await axios.get(url, { headers: getHeaders() });
        console.log("Podkategorie dla kategorii:", categoryName, response.data);
        return response.data;
    } catch (error) {
        console.error('Błąd podczas pobierania podkategorii na podstawie nazwy:', error);
        throw error;
    }
};