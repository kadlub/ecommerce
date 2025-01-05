import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentBlik = ({ amount }) => {
    const [blikCode, setBlikCode] = useState('');
    const navigate = useNavigate();

    const handleSimulatePayment = () => {
        if (blikCode.length !== 6 || isNaN(Number(blikCode))) {
            alert('Wprowadź poprawny kod BLIK (6 cyfr).');
            return;
        }

        const isSuccess = Math.random() > 0.2; // 80% szans na sukces
        navigate('/confirmPayment', { state: { status: isSuccess ? 'success' : 'failure' } });
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
