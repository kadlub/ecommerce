import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addOrderAPI } from '../../api/addOrderAPI'; // Przykładowe API do dodawania zamówienia
import { clearCart } from '../../store/actions/cartAction';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

    const { state } = location; // Dane zamówienia przekazane przez `navigate`
    const { paymentMethod, subTotal, address, selectedDate } = state || {};

    const processPayment = async () => {
        setIsProcessing(true);
        setPaymentStatus('');

        // Symulacja losowego sukcesu płatności
        const isSuccess = Math.random() < 0.8; // 80% szans na sukces

        if (isSuccess) {
            try {
                // API dodawania zamówienia
                const orderData = {
                    address,
                    deliveryDate: selectedDate,
                    paymentMethod,
                    totalAmount: subTotal,
                    items: [], // Dodaj logikę pobierania elementów koszyka
                };

                await addOrderAPI(orderData); // Zarejestrowanie zamówienia w systemie
                dispatch(clearCart()); // Wyczyść koszyk
                setPaymentStatus('success');
                navigate('/orderConfirmed'); // Przejście do potwierdzenia zamówienia
            } catch (err) {
                console.error('Błąd podczas przetwarzania zamówienia:', err);
                setPaymentStatus('error');
            }
        } else {
            setPaymentStatus('failure');
        }

        setIsProcessing(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Payment Page</h1>
            <p>Payment Method: {paymentMethod}</p>
            <p>Total Amount: ${subTotal}</p>
            <p>Delivery Address: {`${address.street}, ${address.buildingNumber}, ${address.city}, ${address.zipCode}`}</p>
            <p>Delivery Date: {selectedDate}</p>

            <button
                onClick={processPayment}
                className={`mt-4 px-6 py-2 text-white rounded-lg ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>

            {paymentStatus === 'success' && (
                <p className="mt-4 text-green-600">Payment Successful! Redirecting...</p>
            )}
            {paymentStatus === 'failure' && (
                <p className="mt-4 text-red-600">Payment Failed! Please try again.</p>
            )}
            {paymentStatus === 'error' && (
                <p className="mt-4 text-red-600">An error occurred while processing your order.</p>
            )}
        </div>
    );
};

export default Payment;
