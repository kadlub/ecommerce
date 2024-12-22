import { getToken } from "../utils/jwt-helper";
export const API_URLS = {
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT: (id) => `/api/products/${id}`,
    GET_CATEGORIES: '/api/categories',
    GET_CATEGORY: (id) => `/api/categories/${id}`,
}

export const API_BASE_URL = 'http://localhost:8080';


export const getHeaders = () => {
    const token = getToken();
    if (!token) {
        throw new Error('Brak tokena JWT. Użytkownik nie jest zalogowany.');
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
