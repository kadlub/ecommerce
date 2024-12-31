import axios from 'axios';
import { API_BASE_URL, API_URLS } from './constant';

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