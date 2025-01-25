import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getUsernameFromToken } from '../../utils/jwt-helper';
import PaymentComponent from './PaymentComponent';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    city: '',
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
    zipCode: '',
  });
  const [zipCodeError, setZipCodeError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().add(2, 'day'));
  const [username, setUsername] = useState(null);

  const subTotal = parseFloat(cartItems.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2));
  const shippingCost = cartItems.length * 15;
  const totalAmount = subTotal + shippingCost;

  useEffect(() => {
    const usernameFromToken = getUsernameFromToken();
    if (usernameFromToken) {
      setUsername(usernameFromToken);
    } else {
      alert('Nie jesteś zalogowany. Zaloguj się, aby kontynuować.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      for (let i = 2; i < 9; i++) {
        dates.push(currentWeekStart.add(i - 2, 'day').format('YYYY-MM-DD'));
      }
      setAvailableDates(dates);
    };

    generateDates();
  }, [currentWeekStart]);

  const handleAddressChange = (field, value) => {
    if (field === 'zipCode') {
      const zipCodeRegex = /^\d{2}-\d{3}$/;
      setZipCodeError(!zipCodeRegex.test(value));
    }
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const requiredFields = ['city', 'street', 'buildingNumber', 'zipCode'];
    const hasEmptyFields = requiredFields.some((field) => !address[field]);
    setAddressError(hasEmptyFields);
    return !hasEmptyFields && !zipCodeError;
  };

  const handlePayment = () => {
    if (!validateAddress()) {
      alert('Proszę wypełnić wszystkie wymagane pola adresu.');
      return;
    }
    // Proceed with payment
  };

  const orderPayload = {
    username,
    deliveryAddress: address,
    deliveryDate: `${selectedDate}T00:00:00`,
    paymentMethod,
    items: cartItems.map((item) => ({
      productId: item.productId,
      productName: item.name,
      price: item.subTotal,
      quantity: item.quantity || 1,
    })),
    totalAmount,
  };

  return (
    <div className="p-8 flex gap-8 items-start">
      <div className="w-[70%]">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Adres dostawy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Miasto"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className={`border rounded-lg px-4 py-2 w-full ${addressError && !address.city ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              placeholder="Kod pocztowy"
              value={address.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              className={`border rounded-lg px-4 py-2 w-full ${zipCodeError ? 'border-red-500' : ''}`}
            />
            {zipCodeError && <p className="text-red-500 text-sm">Kod pocztowy musi być w formacie XX-XXX</p>}
            <input
              type="text"
              placeholder="Ulica"
              value={address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              className={`border rounded-lg px-4 py-2 w-full ${addressError && !address.street ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              placeholder="Numer budynku"
              value={address.buildingNumber}
              onChange={(e) => handleAddressChange('buildingNumber', e.target.value)}
              className={`border rounded-lg px-4 py-2 w-full ${addressError && !address.buildingNumber ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              placeholder="Numer lokalu (opcjonalne)"
              value={address.apartmentNumber}
              onChange={(e) => handleAddressChange('apartmentNumber', e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
          {addressError && <p className="text-red-500 text-sm">Wszystkie wymagane pola muszą być wypełnione</p>}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Wybierz termin dostawy</h2>
          <div className="flex gap-4 items-center overflow-x-auto">
            <button
              onClick={() => {
                const previousStart = currentWeekStart.subtract(7, 'day');
                if (previousStart.isAfter(dayjs().add(1, 'day'))) {
                  setCurrentWeekStart(previousStart);
                }
              }}
              disabled={currentWeekStart.isSame(dayjs().add(2, 'day'), 'day')}
              className={`w-[40px] h-[40px] flex items-center justify-center rounded-full ${currentWeekStart.isSame(dayjs().add(2, 'day'), 'day') ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              <span className="text-lg">&#8592;</span>
            </button>
            <div className="flex gap-4">
              {availableDates.map((date) => (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`w-[120px] h-[48px] flex items-center justify-center border text-center rounded-lg cursor-pointer hover:scale-105 ${selectedDate === date
                    ? 'bg-blue-500 text-white border-blue-700'
                    : 'bg-gray-200 text-gray-600 border-gray-400'
                    }`}
                >
                  {date}
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentWeekStart(currentWeekStart.add(7, 'day'))}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              <span className="text-lg">&#8594;</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Metoda płatności</h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment_method"
                value="Przelewy24"
                onChange={() => setPaymentMethod('Przelewy24')}
                className="accent-blue-500"
              />
              Przelewy24
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment_method"
                value="Blik"
                onChange={() => setPaymentMethod('Blik')}
                className="accent-blue-500"
              />
              Blik
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment_method"
                value="Card"
                onChange={() => setPaymentMethod('Card')}
                className="accent-blue-500"
              />
              Płatność kartą
            </label>
          </div>
        </div>

        <PaymentComponent method={paymentMethod} amount={totalAmount} orderPayload={orderPayload} onPayment={handlePayment} />
      </div>

      <div className="w-[30%] h-auto border rounded-lg border-gray-500 p-4 bg-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Podsumowanie zamówienia</h2>
        <p>Liczba przedmiotów: {cartItems?.length}</p>
        <p>Łączna wartość: {subTotal} zł</p>
        <p>Wysyłka: {shippingCost} zł</p>
        <hr className="my-4" />
        <p className="font-bold">Suma: {totalAmount} zł</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Kupowane produkty:</h3>
          <ul className="list-disc list-inside">
            {cartItems.map((item) => (
              <li key={item.productId} className="text-sm text-gray-700">
                {item.name} - {item.subTotal.toFixed(2)} zł
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
