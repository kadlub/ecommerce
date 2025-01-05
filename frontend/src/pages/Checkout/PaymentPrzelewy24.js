import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/actions/cartAction';
import { addOrderAPI } from '../../api/addOrderAPI';

const PaymentPrzelewy24 = ({ amount, orderPayload }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSimulatePayment = async () => {
        const isSuccess = Math.random() > 0.2; // 80% szans na sukces

        if (isSuccess) {
            try {
                await addOrderAPI(orderPayload); // Wyślij zamówienie
                dispatch(clearCart()); // Wyczyść koszyk
                navigate('/success'); // Przejdź do strony sukcesu
            } catch (error) {
                console.error('Błąd podczas tworzenia zamówienia:', error);
                alert('Nie udało się utworzyć zamówienia. Spróbuj ponownie.');
            }
        } else {
            alert('Płatność przez Przelewy24 nie powiodła się.');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Przelewy24</h2>
            <p>Kwota do zapłaty: ${amount}</p>
            <button
                onClick={handleSimulatePayment}
                className="bg-[#023047] text-white py-2 px-4 rounded hover:bg-[#03586e]"
            >
                Zapłać przez Przelewy24
            </button>
        </div>
    );
};

export default PaymentPrzelewy24;
