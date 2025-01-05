import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { cancelOrderAPI, fetchOrderAPI } from '../../api/userInfo';
import { cancelOrder, loadOrders, selectAllOrders } from '../../store/features/user';
import moment from 'moment';

const Orders = () => {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');

  useEffect(() => {
    dispatch(setLoading(true));
    fetchOrderAPI()
      .then((res) => {
        console.log('Fetched orders from API:', res); // Debugging API response
        dispatch(loadOrders(res));
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
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
      }));

      console.log('Processed orders for display:', displayOrders); // Debugging processed orders
      setOrders(displayOrders);
    }
  }, [allOrders]);

  const onCancelOrder = useCallback((id) => {
    dispatch(setLoading(true));
    cancelOrderAPI(id)
      .then(() => {
        dispatch(cancelOrder(id));
        console.log('Order cancelled:', id); // Debugging cancellation
      })
      .catch((err) => {
        console.error('Error cancelling order:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500 text-white';
      case 'IN_PROGRESS':
        return 'bg-blue-500 text-white';
      case 'SHIPPED':
        return 'bg-purple-500 text-white';
      case 'DELIVERED':
        return 'bg-green-500 text-white';
      case 'CANCELLED':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div>
      {orders?.length > 0 ? (
        <div className='md:w-[70%] w-full'>
          <h1 className='text-2xl mb-4'>My Orders</h1>
          {orders.map((order, index) => {
            console.log('Rendering order:', order); // Debugging orders being rendered
            return (
              <div key={index} className='bg-gray-200 p-4 mb-8'>
                <p className='text-lg font-bold'>Order no. #{order?.id}</p>
                <div className='flex justify-between mt-2'>
                  <div className='flex flex-col text-gray-500 text-sm'>
                    <p>Order Date: {moment(order?.orderDate).format('MMMM DD YYYY')}</p>
                    <p>Total Amount: ${order?.totalAmount}</p>
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
                      {selectedOrder === order?.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {selectedOrder === order?.id && (
                  <div className='mt-4'>
                    {order?.items?.map((item, idx) => (
                      <div key={idx} className='flex gap-4 mb-2'>
                        <div className='flex flex-col text-sm text-gray-600'>
                          <p>{item?.name || 'Product Name'}</p>
                          <p>Quantity: {item?.quantity}</p>
                          <p>Price: ${item?.price}</p>
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default Orders;
