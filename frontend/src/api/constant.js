import { getToken } from "../utils/jwt-helper";
export const API_URLS = {
    GET_PRODUCTS: '/api/products', // Bez prefiksu `/api`, jeśli backend go nie używa.
    GET_PRODUCT: (id) => `/api/products/${id}`,
    GET_CATEGORIES: '/api/categories',
    GET_CATEGORY: (id) => `/api/categories/${id}`,
    GET_USER_PROFILE: '/api/users/profile', // Nowy endpoint do profilu użytkownika.
    LOGIN: '/api/auth/login', // Endpoint logowania
    REGISTER: '/api/auth/register', // Endpoint rejestracji
}

export const API_BASE_URL = 'http://localhost:8080';


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

console.log(getHeaders());
// Oczekiwany wynik:
// {
//     'Authorization': 'Bearer <twój-token-jwt>',
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
// }
