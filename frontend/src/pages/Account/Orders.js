import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { cancelOrderAPI, fetchOrderAPI, submitReviewAPI } from '../../api/userInfo';
import { cancelOrder, loadOrders, selectAllOrders } from '../../store/features/user';
import moment from 'moment';

const Orders = () => {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [ratingVisible, setRatingVisible] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(setLoading(true));
    fetchOrderAPI()
      .then((res) => {
        dispatch(loadOrders(res));
      })
      .catch((err) => {
        console.error('Błąd podczas pobierania zamówień:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  useEffect(() => {
    if (allOrders) {
      const displayOrders = allOrders.map((order) => ({
        id: order?.orderId,
        orderDate: order?.orderDate,
        orderStatus: order?.status,
        items: order?.items?.map((orderItem) => ({
          id: orderItem?.productId,
          name: orderItem?.productName,
          price: orderItem?.price,
          quantity: orderItem?.quantity,
        })),
        totalAmount: order?.totalPrice,
        sellerId: order?.items[0]?.sellerId,
        sellerName: order?.items[0]?.sellerName,
      }));
      setOrders(displayOrders);
    }
  }, [allOrders]);

  const handleAddRating = (sellerId) => {
    const reviewData = {
      reviewedUserId: sellerId, // ID sprzedawcy
      rating: rating,          // Ocena użytkownika
      comment: comment,        // Komentarz użytkownika
    };

    dispatch(setLoading(true)); // Pokazanie loadera
    submitReviewAPI(reviewData)
      .then(() => {
        console.log("Opinia została dodana pomyślnie.");
        setRatingVisible(null); // Ukryj formularz po dodaniu opinii
        setRating("");          // Wyzeruj ocenę
        setComment("");         // Wyzeruj komentarz
      })
      .catch((err) => {
        console.error("Błąd podczas dodawania opinii:", err);
      })
      .finally(() => {
        dispatch(setLoading(false)); // Ukrycie loadera
      });
  };


  const getStatusClass = (status) => {
    return 'bg-gray-300 text-gray-800'; // Stonowany kolor dla wszystkich statusów
  };

  return (
    <div>
      {orders?.length > 0 ? (
        <div className='md:w-[70%] w-full'>
          <h1 className='text-2xl mb-4'>Moje Zamówienia</h1>
          {orders.map((order, index) => {
            return (
              <div key={index} className='bg-gray-200 p-4 mb-8'>
                <p className='text-lg font-bold'>Zamówienie nr #{order?.id}</p>
                <div className='flex justify-between mt-2'>
                  <div className='flex flex-col text-gray-500 text-sm'>
                    <p>Data zamówienia: {moment(order?.orderDate).format('DD MMMM YYYY')}</p>
                    <p>Łączna kwota: {order?.totalAmount} zł</p>
                  </div>
                  <div className='flex items-center'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(order?.orderStatus)}`}
                    >
                      {order?.orderStatus}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order?.id)}
                      className='ml-4 text-blue-900 text-right rounded underline cursor-pointer'
                    >
                      {selectedOrder === order?.id ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
                    </button>
                  </div>
                </div>

                {selectedOrder === order?.id && (
                  <div className='mt-4'>
                    {order?.items?.map((item, idx) => (
                      <div key={idx} className='flex gap-4 mb-2'>
                        <div className='flex flex-col text-sm text-gray-600'>
                          <p>{item?.name || 'Nazwa produktu'}</p>
                          <p>Ilość: {item?.quantity}</p>
                          <p>Cena: {item?.price} zł</p>
                        </div>
                      </div>
                    ))}
                    {ratingVisible === order?.id ? (
                      <div className='mt-4'>
                        <label className='block text-sm font-medium mb-2'>Oceń sprzedawcę:</label>
                        <select
                          className='border border-gray-300 rounded p-2 mb-2'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Wybierz ocenę</option>
                          <option value='1'>1 - Bardzo źle</option>
                          <option value='2'>2 - Źle</option>
                          <option value='3'>3 - Średnio</option>
                          <option value='4'>4 - Dobrze</option>
                          <option value='5'>5 - Bardzo dobrze</option>
                        </select>
                        <textarea
                          className='border border-gray-300 rounded p-2 w-full mb-2'
                          placeholder='Dodaj komentarz (opcjonalne)'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleAddRating(order?.sellerId)}
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                          >
                            Zatwierdź
                          </button>
                          <button
                            onClick={() => {
                              setRatingVisible(null);
                              setRating('');
                              setComment('');
                            }}
                            className='px-4 py-2 bg-gray-300 rounded text-gray-800'
                          >
                            Anuluj
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRatingVisible(order?.id)}
                        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
                      >
                        Wystaw opinię
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>Nie znaleziono zamówień</p>
      )}
    </div>
  );
};

export default Orders;
