import { getToken } from "../utils/jwt-helper";

export const API_URLS = {
    GET_PRODUCTS: '/api/products/by-category',
    GET_PRODUCT: (id) => `/api/products/${id}`,
    GET_CATEGORIES: '/api/categories',
    GET_CATEGORY: (id) => `/api/categories/${id}`,
    GET_USER_PROFILE: '/api/users/profile', // New endpoint for user profile
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
};

export const API_BASE_URL = 'http://localhost:8080';

export const getHeaders = () => {
    const token = getToken();
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.warn("No JWT token found. User might not be logged in.");
    }

    return headers;
};

// Optional: Debugging log (remove in production)
if (process.env.NODE_ENV !== 'production') {
    console.log('Generated Headers:', getHeaders());
}
