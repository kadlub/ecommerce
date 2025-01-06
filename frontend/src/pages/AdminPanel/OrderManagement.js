import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/constant';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [editOrder, setEditOrder] = useState(null);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/api/orders/all`)
            .then((res) => setOrders(res.data))
            .catch((err) => console.error('Error fetching orders:', err));
    }, []);

    const handleDelete = (orderId) => {
        axios
            .delete(`${API_BASE_URL}/api/orders/${orderId}`)
            .then(() => setOrders((prev) => prev.filter((order) => order.orderId !== orderId)))
            .catch((err) => console.error('Error deleting order:', err));
    };

    const handleEdit = (order) => {
        setEditOrder(order);
    };

    const handleSaveEdit = () => {
        axios
            .put(`${API_BASE_URL}/api/orders/${editOrder.orderId}`, editOrder)
            .then(() => {
                setOrders((prev) =>
                    prev.map((order) => (order.orderId === editOrder.orderId ? editOrder : order))
                );
                setEditOrder(null);
            })
            .catch((err) => console.error('Error editing order:', err));
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Order ID</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId}>
                            <td className="border border-gray-300 px-4 py-2">{order.orderId}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editOrder?.orderId === order.orderId ? (
                                    <select
                                        value={editOrder.status}
                                        onChange={(e) =>
                                            setEditOrder({ ...editOrder, status: e.target.value })
                                        }
                                        className="border px-2 py-1"
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                ) : (
                                    order.status
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editOrder?.orderId === order.orderId ? (
                                    <button
                                        onClick={handleSaveEdit}
                                        className="text-green-500 hover:underline mr-4"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(order)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(order.orderId)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManagement;
