import { getToken } from "../utils/jwt-helper";
export const API_URLS = {
    GET_PRODUCTS: '/api/products/by-category',
    GET_PRODUCT: (id) => `/api/products/${id}`,
    GET_CATEGORIES: '/api/categories',
    GET_CATEGORY: (id) => `/api/categories/${id}`,
    GET_USER_PROFILE: '/api/users/profile',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
}

export const API_BASE_URL = '/api';


export const getHeaders = () => {
    const token = getToken();
    if (!token) {
        console.warn("Brak tokena JWT. Użytkownik nie jest zalogowany.");
        return {}; // Zwróć puste nagłówki lub podstawowe nagłówki, jeśli nie ma tokena
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
};

