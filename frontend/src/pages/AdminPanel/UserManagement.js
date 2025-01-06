import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/constant';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/api/users`)
            .then((res) => setUsers(res.data))
            .catch((err) => console.error('Error fetching users:', err));
    }, []);

    const handleDelete = (userId) => {
        axios
            .delete(`${API_BASE_URL}/api/users/${userId}`)
            .then(() => {
                setUsers((prev) => prev.filter((user) => user.userId !== userId));
            })
            .catch((err) => console.error('Error deleting user:', err));
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleDelete(user.userId)}
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

export default UserManagement;
