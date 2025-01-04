import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-green-500">Płatność zakończona sukcesem!</h1>
            <p className="my-4">Dziękujemy za zakupy w naszym sklepie.</p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Powrót do sklepu
            </button>
        </div>
    );
};

export default Success;
