import axios from 'axios';
import { API_BASE_URL } from './constant';

export const addOrderAPI = async (orderData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error('Błąd podczas dodawania zamówienia:', error);
        throw error;
    }
};
