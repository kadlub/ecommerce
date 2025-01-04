import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import { clearCart } from '../../store/actions/cartAction';

const ConfirmPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Symulacja potwierdzenia płatności
        const query = new URLSearchParams(location.search);
        const paymentStatus = query.get('status'); // 'success' lub 'failure'

        setTimeout(() => {
            if (paymentStatus === 'success') {
                setStatus('success');
                dispatch(clearCart());
                navigate('/orderConfirmed?orderId=123456'); // Przykładowy ID zamówienia
            } else {
                setStatus('failure');
                navigate('/checkout');
            }
            setLoading(false);
        }, 3000); // Symulacja czasu autoryzacji
    }, [location.search, navigate, dispatch]);

    return (
        <div className="p-8 text-center">
            {loading ? (
                <>
                    <p className="text-xl font-bold">Processing your payment...</p>
                    <Spinner />
                </>
            ) : status === 'success' ? (
                <p className="text-green-500">Payment Successful! Redirecting...</p>
            ) : (
                <p className="text-red-500">Payment Failed! Redirecting...</p>
            )}
        </div>
    );
};

export default ConfirmPayment;
