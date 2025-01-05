import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) {
            console.error("Token does not contain 'exp' field");
            return false;
        }
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token is expired
        return decoded.exp > currentTime;
    } catch (error) {
        console.error("Invalid token", error);
        return false;
    }
}

export const saveToken = (token) => {
    localStorage.setItem('authToken', token);
}

export const logOut = () => {
    console.info("Logging out user, clearing token.");
    localStorage.removeItem('authToken');
};

export const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded?.userId || null; // Zakładamy, że `userId` jest w tokenie
    } catch (error) {
        console.error("Nie udało się zdekodować tokena", error);
        return null;
    }
};
export const getUsernameFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        // username znajduje się w polu `sub` tokena
        return decoded.sub || null;
    } catch (error) {
        console.error("Błąd dekodowania tokena:", error);
        return null;
    }
};

export const getToken = () => {
    return localStorage.getItem('authToken');
}