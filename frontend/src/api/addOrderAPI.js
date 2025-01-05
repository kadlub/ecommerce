import axios from 'axios';
import { API_BASE_URL, getHeaders } from './constant';

export const addOrderAPI = async (orderData) => {
    try {
        const headers = getHeaders(); // Pobierz nagłówki, w tym token JWT
        const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
            headers, // Dodaj nagłówki do żądania
        });
        return response.data;
    } catch (error) {
        console.error('Błąd podczas dodawania zamówienia:', error);
        throw error;
    }
};
