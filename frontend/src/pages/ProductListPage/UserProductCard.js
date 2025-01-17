import React, { useState } from "react";
import { Link } from "react-router-dom";
import EditProductForm from "./EditProductForm";
import { API_BASE_URL } from "../../api/constant";

const UserProductCard = ({ productId, title, description, price, imageUrls, slug, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const imageBaseUrl = `${API_BASE_URL}/api/uploads/products/`;
    const thumbnail = imageUrls?.length > 0 ? `${imageBaseUrl}${imageUrls[0]}` : "/placeholder-image.png";

    const handleEdit = () => {
        setIsEditing(true);
        setMenuOpen(false); // Zamknij menu po kliknięciu
    };

    const handleDelete = () => {
        onDelete(productId);
        setMenuOpen(false); // Zamknij menu po kliknięciu
    };

    return (
        <div className="flex flex-col relative border rounded-lg shadow-lg p-4">
            {isEditing && (
                <EditProductForm
                    product={{
                        productId,
                        name: title,
                        description,
                        price,
                        imageUrls,
                    }}
                    onClose={() => setIsEditing(false)}
                />
            )}
            <Link to={`/products/${slug}`}>
                <img
                    className="h-[320px] w-[280px] border rounded-lg cursor-pointer object-contain"
                    src={thumbnail}
                    alt={title}
                />
            </Link>
            <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col">
                    <p className="text-[16px] font-semibold">{title}</p>
                    {description && <p className="text-[12px] text-gray-600 truncate">{description}</p>}
                </div>
                <p className="text-lg font-bold">${price}</p>
            </div>
            <div className="relative mt-4">
                {/* Menu trigger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-gray-600 hover:text-black focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                    </svg>
                </button>
                {/* Menu dropdown */}
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        <button
                            onClick={handleEdit}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Edytuj
                        </button>
                        <button
                            onClick={handleDelete}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        >
                            Usuń
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProductCard;
