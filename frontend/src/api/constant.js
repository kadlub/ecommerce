import { getToken } from "../utils/jwt-helper";
export const API_URLS = {
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT: (id) => `/api/products/${id}`,
    GET_CATEGORIES: '/api/categories',
    GET_CATEGORY: (id) => `/api/categories/${id}`,
}

export const API_BASE_URL = 'http://localhost:8080';


export const getHeaders = () => {
    return {
        'Authorization': `Bearer ${getToken()}`
    }
}