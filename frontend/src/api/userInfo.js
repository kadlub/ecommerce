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
    const url = API_BASE_URL + "/api/users/info";
    const headers = getHeaders();

    console.log("fetchUserInfo headers:", headers);

    if (!headers.Authorization) {
        console.warn("Brak nagłówka Authorization. Użytkownik nie jest zalogowany.");
        throw new Error("Unauthorized");
    }

    try {
        const response = await axios.get(url, { headers });
        console.log("fetchUserInfo Response:", response?.data);
        return response?.data;
    } catch (err) {
        console.error("Error fetching user info:", err.response || err.message);
        throw err;
    }
};

export const submitReviewAPI = async (reviewData) => {
    const url = `${API_BASE_URL}/api/reviews`; // Endpoint do dodawania opinii
    try {
        const response = await axios.post(url, reviewData, {
            headers: getHeaders(), // Korzystamy z funkcji getHeaders do uwierzytelnienia
        });
        return response?.data; // Zwracamy odpowiedź
    } catch (err) {
        console.error("Błąd podczas dodawania opinii:", err.response?.data || err.message);
        throw err;
    }
};

export const fetchUserReviewsAPI = async () => {
    const url = API_BASE_URL + "/api/reviews/me";
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

export const updateUserDetailsAPI = async (data) => {
    const url = API_BASE_URL + '/api/users/update';
    try {
        const response = await axios.put(url, data, {
            headers: getHeaders(),
        });
        return response?.data;
    } catch (err) {
        console.error("Error updating user details:", err.response?.data || err.message);
        throw err;
    }
};

export const fetchAllUsersForAdmin = async () => {
    const url = API_BASE_URL + '/api/users/all';
    try {
        const response = await axios.get(url, {
            headers: getHeaders(), // Nagłówki zawierające token JWT
        });
        return response?.data;
    } catch (err) {
        console.error("Error fetching all users for admin:", err);
        throw err;
    }
};
