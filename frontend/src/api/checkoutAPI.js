import { API_BASE_URL, getHeaders } from './constants';

// Funkcja, która obsługuje żądania związane z checkoutem
export const checkoutAPI = async (endpoint, method = 'GET', body = null) => {
    // Pobieramy nagłówki
    const headers = getHeaders();

    // Dodajemy obsługę tokena
    if (!headers['Authorization']) {
        console.warn("Token JWT nie został znaleziony. Dodawanie tokenu ręcznie.");
        const token = localStorage.getItem('jwtToken'); // Sprawdź, czy token istnieje w localStorage
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Budujemy konfigurację żądania
    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body); // Dodajemy body, jeśli istnieje
    }

    // Wysyłamy żądanie do API
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json();
        console.error("Błąd podczas komunikacji z checkout API:", error);
        throw new Error(error.message || 'Błąd serwera');
    }

    return await response.json();
};
