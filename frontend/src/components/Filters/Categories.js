import React from 'react';

const Categories = ({ types, onCategoryClick }) => {
  // Komponent rekurencyjny do renderowania kategorii i podkategorii
  const renderCategories = (categories) => {
    return categories.map((category) => (
      <div key={category.categoryId} className="ml-2">
        <div className="flex items-center p-1">
          <input
            type="checkbox"
            id={category.categoryId}
            className="border rounded-xl w-4 h-4 accent-black text-black"
            onChange={() => onCategoryClick(category.name)} // Obsługa kliknięcia
          />
          <label
            htmlFor={category.categoryId}
            className="ml-2 text-[14px] text-gray-600"
          >
            {category.name}
          </label>
        </div>
        {/* Rekurencyjne wyświetlanie podkategorii */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div>{renderCategories(category.subcategories)}</div>
        )}
      </div>
    ));
  };

  return (
    <div>
      {types && types.length > 0 ? (
        renderCategories(types)
      ) : (
        <p className="text-gray-500">Brak kategorii</p>
      )}
    </div>
  );
};

export default Categories;
