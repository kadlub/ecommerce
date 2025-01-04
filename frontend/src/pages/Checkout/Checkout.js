import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { setLoading } from '../../store/features/common';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs());

  const subTotal = cartItems.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2);

  // Generowanie dostępnych terminów
  useEffect(() => {
    const generateDates = (start) => {
      const dates = [];
      for (let i = 0; i < 7; i++) {
        dates.push(start.add(i, 'day').format('YYYY-MM-DD'));
      }
      return dates;
    };
    setAvailableDates(generateDates(currentWeekStart));
  }, [currentWeekStart]);

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayNow = () => {
    if (!address.city || !address.street || !address.buildingNumber || !selectedDate || !paymentMethod) {
      alert('Proszę uzupełnić wszystkie wymagane dane.');
      return;
    }

    navigate('/payment', {
      state: {
        paymentMethod,
        subTotal,
        address,
        selectedDate,
      },
    });
  };

  return (
    <div className="p-8 flex gap-8">
      {/* Sekcja informacji o zamówieniu */}
      <div className="w-[70%]">
        {/* Adres dostawy */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Adres dostawy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Miasto"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Kod pocztowy"
              value={address.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Ulica"
              value={address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Numer budynku"
              value={address.buildingNumber}
              onChange={(e) => handleAddressChange('buildingNumber', e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Numer lokalu (opcjonalne)"
              value={address.apartmentNumber}
              onChange={(e) => handleAddressChange('apartmentNumber', e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Wybór terminu dostawy */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Wybierz termin dostawy</h2>
          <div className="flex gap-4 items-center overflow-x-auto">
            <button
              onClick={() => setCurrentWeekStart((prev) => prev.subtract(7, 'day'))}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
            >
              Poprzedni tydzień
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
              onClick={() => setCurrentWeekStart((prev) => prev.add(7, 'day'))}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
            >
              Następny tydzień
            </button>
          </div>
        </div>

        {/* Metoda płatności */}
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
          </div>
        </div>

        {/* Przycisk potwierdzenia */}
        <button
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          onClick={handlePayNow}
        >
          Złóż zamówienie
        </button>
      </div>

      {/* Podsumowanie zamówienia */}
      <div className="w-[30%] h-auto border rounded-lg border-gray-500 p-4 bg-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Podsumowanie zamówienia</h2>
        <p>Liczba przedmiotów: {cartItems?.length}</p>
        <p>Łączna wartość: ${subTotal}</p>
        <p>Wysyłka: Darmowa</p>
        <hr className="my-4" />
        <p className="font-bold">Suma: ${subTotal}</p>
      </div>
    </div>
  );
};

export default Checkout;
