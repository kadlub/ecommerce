import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/actions/cartAction';
import { addOrderAPI } from '../../api/addOrderAPI';

const PaymentCard = ({ amount, orderPayload }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSimulatePayment = async () => {
        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Wprowadź poprawny numer karty (16 cyfr).');
            return;
        }
        if (!/^\d{3}$/.test(cvv)) {
            alert('Wprowadź poprawny kod CVV (3 cyfry).');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert('Wprowadź poprawną datę ważności (MM/RR).');
            return;
        }

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
            alert('Płatność kartą nie powiodła się.');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Płatność kartą</h2>
            <p>Kwota do zapłaty: ${amount}</p>
            <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={16}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Numer karty (16 cyfr)"
            />
            <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Data ważności (MM/RR)"
            />
            <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Kod CVV"
            />
            <button
                onClick={handleSimulatePayment}
                className="bg-[#023047] text-white py-2 px-4 rounded hover:bg-[#03586e]"
            >
                Zapłać kartą
            </button>
        </div>
    );
};

export default PaymentCard;
