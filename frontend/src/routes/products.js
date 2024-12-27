import { getProductBySlug } from '../api/fetchProducts';
import { setLoading } from '../store/features/common';
import store from '../store/store';

export const loadProductBySlug = async ({ params }) => {
    try {
        // Ustaw stan ładowania na true
        store.dispatch(setLoading(true));

        // Pobierz produkt na podstawie slug
        const product = await getProductBySlug(params?.slug);

        // Jeśli produkt nie zostanie znaleziony, zwróć odpowiedni komunikat
        if (!product) {
            throw new Error(`Produkt o slug "${params?.slug}" nie został znaleziony.`);
        }

        // Ustaw stan ładowania na false i zwróć produkt
        store.dispatch(setLoading(false));
        return { product };
    } catch (err) {
        // Logowanie błędu do konsoli
        console.error('Błąd podczas ładowania produktu:', err.message);

        // Ustaw stan ładowania na false w przypadku błędu
        store.dispatch(setLoading(false));

        // Opcjonalnie: Możesz przekazać błąd do routera
        throw new Response(err.message || 'Nie udało się załadować produktu.', { status: 404 });
    }
};
