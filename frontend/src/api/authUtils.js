import { jwtDecode } from "jwt-decode";

export const getSellerIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Brak tokena JWT.");
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Pobierz userId z pola sub
        const userId = decodedToken.sub;
        if (!userId) {
            console.error("Invalid token structure, missing `sub`.");
            return null;
        }

        return userId;
    } catch (error) {
        console.error("Błąd podczas dekodowania tokena:", error.message);
        return null;
    }
};
