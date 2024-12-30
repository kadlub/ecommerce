import axios from 'axios';
import { API_BASE_URL, getHeaders } from './constant';

export const createProductAPI = async (formData) => {
    const url = `${API_BASE_URL}/api/products`;
    try {
        const response = await axios.post(url, formData, {
            headers: {
                ...getHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error.response?.data || error.message);
        throw error;
    }
};
