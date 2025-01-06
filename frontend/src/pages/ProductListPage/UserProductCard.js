import React, { useState } from "react";
import { Link } from "react-router-dom";
import EditProductForm from "./EditProductForm";

const UserProductCard = ({ productId, title, description, price, discount, imageUrls, slug }) => {
    const [isEditing, setIsEditing] = useState(false);
    const imageBaseUrl = "http://localhost:8080/api/uploads/products/";
    const thumbnail = imageUrls?.length > 0 ? `${imageBaseUrl}${imageUrls[0]}` : "/placeholder-image.png";

    const handleEdit = () => setIsEditing(true);

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
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleEdit}
                    className="bg-yellow-500 text-white py-1 px-4 rounded-lg text-sm hover:bg-yellow-600"
                >
                    Edit
                </button>
            </div>
        </div>
    );
};

export default UserProductCard;
