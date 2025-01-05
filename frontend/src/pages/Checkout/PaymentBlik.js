import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/actions/cartAction';
import { addOrderAPI } from '../../api/addOrderAPI';

const PaymentBlik = ({ amount, orderPayload }) => {
    const [blikCode, setBlikCode] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSimulatePayment = async () => {
        if (blikCode.length !== 6 || isNaN(Number(blikCode))) {
            alert('Wprowadź poprawny kod BLIK (6 cyfr).');
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
            alert('Płatność nie powiodła się.');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">BLIK</h2>
            <p>Kwota do zapłaty: ${amount}</p>
            <input
                type="text"
                value={blikCode}
                onChange={(e) => setBlikCode(e.target.value)}
                maxLength={6}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Wprowadź kod BLIK"
            />
            <button
                onClick={handleSimulatePayment}
                className="bg-[#023047] text-white py-2 px-4 rounded hover:bg-[#03586e]"
            >
                Zapłać przez BLIK
            </button>
        </div>
    );
};

export default PaymentBlik;
