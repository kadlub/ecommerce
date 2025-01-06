import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminPanel = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Panel Admina</h1>
            <nav className="grid grid-cols-4 gap-4 mb-8">
                <Link to="/admin/categories" className="bg-blue-500 text-white px-4 py-2 rounded text-center">
                    Zarządzanie kategoriami
                </Link>
                <Link to="/admin/products" className="bg-green-500 text-white px-4 py-2 rounded text-center">
                    Zarządzanie produktami
                </Link>
                <Link to="/admin/users" className="bg-yellow-500 text-white px-4 py-2 rounded text-center">
                    Zarządzanie użytkownikami
                </Link>
                <Link to="/admin/orders" className="bg-red-500 text-white px-4 py-2 rounded text-center">
                    Zarządzanie zamówieniami
                </Link>
            </nav>
            <Outlet />
        </div>
    );
};

export default AdminPanel;
