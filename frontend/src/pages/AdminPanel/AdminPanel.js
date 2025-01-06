import React, { useState } from 'react';
import CategoryManagement from './CategoryManagement';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('categories'); // Domyślnie kategorie
    console.log("AdminPanel renderowany");

    const renderContent = () => {
        switch (activeTab) {
            case 'categories':
                return <CategoryManagement />;
            case 'products':
                return <ProductManagement />;
            case 'users':
                return <UserManagement />;
            case 'orders':
                return <OrderManagement />;
            default:
                return <CategoryManagement />;
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Panel Administratora</h1>
            <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab('categories')} className="text-lg underline">Kategorie</button>
                <button onClick={() => setActiveTab('products')} className="text-lg underline">Produkty</button>
                <button onClick={() => setActiveTab('users')} className="text-lg underline">Użytkownicy</button>
                <button onClick={() => setActiveTab('orders')} className="text-lg underline">Zamówienia</button>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default AdminPanel;
