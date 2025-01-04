import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPrzelewy24 = ({ amount }) => {
    const navigate = useNavigate();

    const handleSimulatePayment = () => {
        const isSuccess = Math.random() > 0.2; // 80% szans na sukces
        navigate('/confirmPayment', { state: { status: isSuccess ? 'success' : 'failure' } });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Przelewy24</h2>
            <p>Kwota do zapłaty: ${amount}</p>
            <button
                onClick={handleSimulatePayment}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Zapłać przez Przelewy24
            </button>
        </div>
    );
};

export default PaymentPrzelewy24;
