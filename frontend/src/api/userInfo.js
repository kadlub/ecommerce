import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

export const fetchUserDetails = async () => {
    const url = API_BASE_URL + '/api/users/profile';
    try {
        const response = await axios(url, {
            method: "GET",
            headers: getHeaders()
        });
        return response?.data;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const addAddressAPI = async (data) => {
    const url = API_BASE_URL + '/api/address';
    try {
        const response = await axios(url, {
            method: "POST",
            data: data,
            headers: getHeaders()
        });
        return response?.data;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const deleteAddressAPI = async (id) => {
    const url = API_BASE_URL + `/api/address/${id}`;
    try {
        const response = await axios(url, {
            method: "DELETE",
            headers: getHeaders()
        });
        return response?.data;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const fetchOrderAPI = async () => {
    const url = API_BASE_URL + `/api/orders/user`;
    try {
        const response = await axios(url, {
            method: "GET",
            headers: getHeaders()
        });
        return response?.data;
    } catch (err) {
        throw new Error(err);
    }
};

export const cancelOrderAPI = async (id) => {
    const url = API_BASE_URL + `/api/orders/cancel/${id}`;
    try {
        const response = await axios(url, {
            method: "POST",
            headers: getHeaders()
        });
        return response?.data;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const fetchUserProductsAPI = async () => {
    const url = API_BASE_URL + "/api/products/my-products";
    try {
        const response = await axios.get(url, {
            headers: getHeaders(),
        });
        return response?.data;
    } catch (error) {
        console.error("Error fetching user products:", error);
        throw error;
    }
};

export const fetchUserInfo = async () => {
    const url = API_BASE_URL + "/api/users/info"; // URL do pobrania informacji o użytkowniku
    try {
        const response = await axios(url, {
            method: "GET",
            headers: getHeaders(), // Pobranie nagłówków, w tym tokenu JWT
        });
        console.log("fetchUserInfo Response:", response?.data); // Logowanie odpowiedzi
        return response?.data; // Zwracanie danych użytkownika
    } catch (err) {
        console.error("Error fetching user info:", err);
        throw new Error(err); // Rzucenie błędu w razie niepowodzenia
    }
};
