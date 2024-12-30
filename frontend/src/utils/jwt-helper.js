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
    localStorage.removeItem('authToken'); // Usuń token z localStorage
    window.location.reload(); // Opcjonalne, odświeża stronę, aby wymusić ponowne zalogowanie
};

export const getToken = () => {
    return localStorage.getItem('authToken');
}