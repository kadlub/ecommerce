import axios from 'axios';
import { API_BASE_URL, API_URLS, getHeaders } from './constant';

// Pobieranie wszystkich produktów według kategorii lub typu
export const getAllProducts = async (categoryId, subcategoryId) => {
    let url = `${API_BASE_URL}${API_URLS.GET_PRODUCTS}?categoryId=${categoryId}`;
    if (subcategoryId) {
        url += `&subcategoryId=${subcategoryId}`;
    }

    try {
        const result = await axios(url, {
            method: 'GET',
            headers: getHeaders()
        });
        return result?.data || [];
    } catch (err) {
        console.error('Błąd podczas pobierania produktów:', err.message);
        throw new Error('Nie udało się pobrać produktów.');
    }
};

// Pobieranie szczegółów produktu według slug
export const getProductBySlug = async (slug) => {
    const url = `${API_BASE_URL}/api/products/slug/${slug}`; // Zmiana na `/api/products/slug/`
    try {
        const result = await axios(url, {
            method: 'GET',
            headers: getHeaders()
        });
        return result?.data || null;
    } catch (err) {
        console.error('Błąd podczas pobierania szczegółów produktu:', err.message);
        throw new Error('Nie udało się pobrać szczegółów produktu.');
    }
};


// Pobieranie wszystkich kategorii
export const fetchAllCategories = async () => {
    const url = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`;
    try {
        const result = await axios(url, {
            method: 'GET',
            headers: getHeaders()
        });
        return result?.data || [];
    } catch (err) {
        console.error('Błąd podczas pobierania kategorii:', err.message);
        throw new Error('Nie udało się pobrać kategorii.');
    }
};

// Pobieranie szczegółów kategorii według ID
export const fetchCategoryById = async (id) => {
    const url = `${API_BASE_URL}${API_URLS.GET_CATEGORY(id)}`;
    try {
        const result = await axios(url, {
            method: 'GET',
            headers: getHeaders()
        });
        return result?.data || null;
    } catch (err) {
        console.error('Błąd podczas pobierania szczegółów kategorii:', err.message);
        throw new Error('Nie udało się pobrać szczegółów kategorii.');
    }
};

// Pobieranie drzewa kategorii z podkategoriami
export const fetchCategoriesTree = async () => {
    const url = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/tree`;
    try {
        const result = await axios(url, {
            method: 'GET',
            headers: getHeaders()
        });
        return result?.data || []; // Oczekiwany format: [{...category, subcategories: []}]
    } catch (err) {
        console.error('Błąd podczas pobierania drzewa kategorii:', err.message);
        throw new Error('Nie udało się pobrać drzewa kategorii.');
    }
};

// Pobieranie wszystkich produktów według nazwy kategorii
export const getAllProductsByCategoryName = async (categoryName) => {
    const url = `${API_BASE_URL}/api/products/by-category/${categoryName}`;
    try {
        const result = await axios.get(url, { headers: getHeaders() });
        return result?.data || [];
    } catch (err) {
        console.error('Błąd podczas pobierania produktów po nazwie kategorii:', err.message);
        throw new Error('Nie udało się pobrać produktów.');
    }
};
