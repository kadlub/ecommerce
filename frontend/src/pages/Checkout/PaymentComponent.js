import React from 'react';
import PaymentBlik from './PaymentBlik';
import PaymentPrzelewy24 from './PaymentPrzelewy24';
import PaymentCard from './PaymentCard';

const PaymentComponent = ({ method, amount, orderPayload }) => {
    switch (method) {
        case 'Blik':
            return <PaymentBlik amount={amount} orderPayload={orderPayload} />;
        case 'Przelewy24':
            return <PaymentPrzelewy24 amount={amount} orderPayload={orderPayload} />;
        case 'Card':
            return <PaymentCard amount={amount} orderPayload={orderPayload} />;
        default:
            return <p>Wybierz metodę płatności, aby kontynuować.</p>;
    }
};
export default PaymentComponent;

