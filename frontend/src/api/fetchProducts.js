import axios from 'axios';
import { API_BASE_URL, API_URLS, getHeaders } from './constant';

// Pobieranie wszystkich produktów według kategorii lub podkategorii
export const getAllProducts = async (categoryId, subcategoryId) => {
    if (!categoryId) {
        console.warn("Brak identyfikatora kategorii. Pobieranie wszystkich produktów.");
    }

    let url = `${API_BASE_URL}/api/products`;
    if (categoryId || subcategoryId) {
        url += '?';
        if (categoryId) url += `categoryId=${categoryId}&`;
        if (subcategoryId) url += `subcategoryId=${subcategoryId}`;
        url = url.slice(0, -1); // Usuń ostatni "&"
    }

    try {
        const result = await axios.get(url, { headers: getHeaders() });
        console.log('Odpowiedź API:', result.data);
        return result?.data || [];
    } catch (err) {
        console.error('Błąd podczas pobierania produktów:', err.message, 'Szczegóły:', err);
        throw new Error('Nie udało się pobrać produktów.');
    }
};

// Pobieranie szczegółów produktu według slug
export const getProductBySlug = async (slug) => {
    if (!slug) {
        console.warn("Brak slug. Nie można pobrać szczegółów produktu.");
        throw new Error("Brak slug dla produktu.");
    }

    const url = `${API_BASE_URL}/api/products/slug/${slug}`;
    try {
        const result = await axios.get(url, { headers: getHeaders() });
        console.log('Odpowiedź API:', result.data);
        return result?.data || null;
    } catch (err) {
        console.error('Błąd podczas pobierania szczegółów produktu:', err.message, 'Szczegóły:', err);
        throw new Error('Nie udało się pobrać szczegółów produktu.');
    }
};

// Pobieranie wszystkich kategorii
export const fetchAllCategories = async () => {
    const url = `${API_BASE_URL}/api/categories`;
    try {
        const result = await axios.get(url, { headers: getHeaders() });
        return result?.data || [];
    } catch (err) {
        console.error('Błąd podczas pobierania kategorii:', err.message, 'Szczegóły:', err);
        throw new Error('Nie udało się pobrać kategorii.');
    }
};

// Pobieranie szczegółów kategorii według ID
export const fetchCategoryById = async (id) => {
    if (!id) {
        console.warn("Brak ID kategorii. Nie można pobrać szczegółów.");
        throw new Error("Brak ID kategorii.");
    }

    const url = `${API_BASE_URL}/api/categories/${id}`;
    try {
        const result = await axios.get(url, { headers: getHeaders() });
        return result?.data || null;
    } catch (err) {
        console.error('Błąd podczas pobierania szczegółów kategorii:', err.message, 'Szczegóły:', err);
        throw new Error('Nie udało się pobrać szczegółów kategorii.');
    }
};

// Pobieranie drzewa kategorii z podkategoriami
export const fetchCategoriesTree = async () => {
    const url = `${API_BASE_URL}/api/categories/tree`;
    try {
        const result = await axios.get(url, { headers: getHeaders() });
        return result?.data || [];
    } catch (err) {
        console.error('Błąd podczas pobierania drzewa kategorii:', err.message, 'Szczegóły:', err);
        throw new Error('Nie udało się pobrać drzewa kategorii.');
    }
};

// Pobieranie wszystkich produktów według nazwy kategorii
export const getAllProductsByCategoryName = async (categoryName) => {
    if (!categoryName) {
        console.warn("Brak nazwy kategorii. Nie można pobrać produktów.");
        throw new Error("Brak nazwy kategorii.");
    }

    // Kodowanie nazwy kategorii, aby uniknąć problemów z polskimi znakami
    const encodedCategoryName = encodeURIComponent(categoryName);
    const url = `${API_BASE_URL}/api/products/by-category/${encodeURIComponent(categoryName)}`;

    try {
        const result = await axios.get(url, { headers: getHeaders() });
        return result?.data || [];
    } catch (err) {
        console.error('Błąd podczas pobierania produktów po nazwie kategorii:', err.message, 'Szczegóły:', err);
        throw new Error('Nie udało się pobrać produktów.');
    }
};

// Filtrowanie produktów
export const getFilteredProducts = async (filters) => {
    const { categoryNames, priceMin, priceMax } = filters;

    try {
        const response = await axios.get(`${API_BASE_URL}/api/products/filter`, {
            params: { categoryNames, priceMin, priceMax },
            headers: getHeaders(),
        });
        return response.data || [];
    } catch (err) {
        console.error('Błąd podczas filtrowania produktów:', err);
        throw err;
    }
};

