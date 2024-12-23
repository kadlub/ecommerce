import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Pobieranie wszystkich produktów według kategorii lub typu
export const getAllProducts = async (id, typeId) => {
    let url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?categoryId=${id}`;
    if (typeId) {
        url = url + `&typeId=${typeId}`;
    }

    try {
        const result = await axios(url, {
            method: "GET",
            headers: getHeaders(),
        });
        return result?.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Pobieranie szczegółów produktu według slug
export const getProductBySlug = async (slug) => {
    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
    try {
        const result = await axios(url, {
            method: "GET",
            headers: getHeaders(),
        });
        return result?.data?.[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Pobieranie wszystkich kategorii
export const fetchAllCategories = async () => {
    const url = API_BASE_URL + API_URLS.GET_CATEGORIES;
    try {
        const result = await axios(url, {
            method: "GET",
            headers: getHeaders(),
        });
        return result?.data;
    } catch (err) {
        console.error("Błąd podczas pobierania kategorii:", err);
        throw err;
    }
};

// Pobieranie szczegółów kategorii według ID
export const fetchCategoryById = async (id) => {
    const url = API_BASE_URL + API_URLS.GET_CATEGORY(id);
    try {
        const result = await axios(url, {
            method: "GET",
            headers: getHeaders(),
        });
        return result?.data;
    } catch (err) {
        console.error("Błąd podczas pobierania szczegółów kategorii:", err);
        throw err;
    }
};
