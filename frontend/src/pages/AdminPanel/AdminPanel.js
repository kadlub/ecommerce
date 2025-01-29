import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminPanel = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel Admina</h1>
            <nav className="grid grid-cols-4 gap-4 mb-8">
                <Link
                    to="/admin/categories"
                    className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-lg shadow hover:shadow-md text-center text-gray-700 hover:bg-gray-100"
                >
                    Zarządzanie kategoriami
                </Link>
                <Link
                    to="/admin/products"
                    className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-lg shadow hover:shadow-md text-center text-gray-700 hover:bg-gray-100"
                >
                    Zarządzanie produktami
                </Link>
                <Link
                    to="/admin/users"
                    className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-lg shadow hover:shadow-md text-center text-gray-700 hover:bg-gray-100"
                >
                    Zarządzanie użytkownikami
                </Link>
                <Link
                    to="/admin/orders"
                    className="border border-gray-300 bg-gray-50 px-4 py-3 rounded-lg shadow hover:shadow-md text-center text-gray-700 hover:bg-gray-100"
                >
                    Zarządzanie zamówieniami
                </Link>
            </nav>
            <Outlet />
        </div>
    );
};

export default AdminPanel;
