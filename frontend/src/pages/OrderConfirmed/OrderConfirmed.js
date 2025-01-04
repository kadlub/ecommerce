import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const OrderConfirmed = () => {
  const location = useLocation();

  const orderId = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get('orderId') || 'N/A';
  }, [location.search]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-500">Thank you for your purchase!</h1>
      <p className="mt-4">
        Your order has been successfully placed. Your order ID is{' '}
        <strong className="text-blue-500">{orderId}</strong>.
      </p>
      <p className="mt-2">We hope to see you again soon!</p>
    </div>
  );
};

export default OrderConfirmed;
