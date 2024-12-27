import axios from 'axios';
import { API_BASE_URL, getHeaders } from './constant';

// API method to create a new product
export const createProductAPI = async (formData) => {
    const url = `${API_BASE_URL}/api/products`;
    try {
        const response = await axios.post(url, formData, {
            headers: {
                ...getHeaders(),
                'Content-Type': 'multipart/form-data', // Ensure correct headers for file uploads
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error.response?.data || error.message);
        throw error;
    }
};
