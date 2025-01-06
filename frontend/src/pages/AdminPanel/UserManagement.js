import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/constant';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/api/users`)
            .then((res) => setUsers(res.data))
            .catch((err) => console.error('Error fetching users:', err));
    }, []);

    const handleDelete = (userId) => {
        axios
            .delete(`${API_BASE_URL}/api/users/${userId}`)
            .then(() => setUsers((prev) => prev.filter((user) => user.userId !== userId)))
            .catch((err) => console.error('Error deleting user:', err));
    };

    const handleEdit = (user) => {
        setEditUser(user);
    };

    const handleSaveEdit = () => {
        axios
            .put(`${API_BASE_URL}/api/users/${editUser.userId}`, editUser)
            .then(() => {
                setUsers((prev) =>
                    prev.map((user) => (user.userId === editUser.userId ? editUser : user))
                );
                setEditUser(null);
            })
            .catch((err) => console.error('Error editing user:', err));
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Zarządzaj użytkownikami</h1>
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
                            <td className="border border-gray-300 px-4 py-2">
                                {editUser?.userId === user.userId ? (
                                    <input
                                        type="text"
                                        value={editUser.username}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, username: e.target.value })
                                        }
                                        className="border px-2 py-1"
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
                                        className="border px-2 py-1"
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editUser?.userId === user.userId ? (
                                    <button
                                        onClick={handleSaveEdit}
                                        className="text-green-500 hover:underline mr-4"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Edit
                                    </button>
                                )}
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
