import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, getHeaders } from '../../api/constant';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/api/users/all`, { headers: getHeaders() })
            .then((res) => setUsers(res.data))
            .catch((err) => {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        axios
            .delete(`${API_BASE_URL}/api/users/${userId}`, { headers: getHeaders() })
            .then(() => setUsers((prev) => prev.filter((user) => user.userId !== userId)))
            .catch((err) => console.error('Error deleting user:', err));
    };

    const handleEdit = (user) => {
        setEditUser(user);
    };

    const handleSaveEdit = () => {
        axios
            .put(`${API_BASE_URL}/api/users/${editUser.userId}`, editUser, { headers: getHeaders() })
            .then(() => {
                setUsers((prev) =>
                    prev.map((user) => (user.userId === editUser.userId ? editUser : user))
                );
                setEditUser(null);
            })
            .catch((err) => console.error('Error editing user:', err));
    };

    const resetEdit = () => {
        setEditUser(null);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p className="text-gray-600">Loading users...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                                Nazwa
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                                Email
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                                Akcje
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userId} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                    {editUser?.userId === user.userId ? (
                                        <input
                                            type="text"
                                            value={editUser.username}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, username: e.target.value })
                                            }
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {editUser?.userId === user.userId ? (
                                        <input
                                            type="text"
                                            value={editUser.email}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, email: e.target.value })
                                            }
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 flex items-center gap-4">
                                    {editUser?.userId === user.userId ? (
                                        <>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Zapisz
                                            </button>
                                            <button
                                                onClick={resetEdit}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Anuluj
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Edytuj
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.userId)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Usuń
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserManagement;
