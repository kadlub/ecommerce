import React, { useState } from 'react';

const Categories = ({ types, onCategoryClick }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (categoryName) => {
    const updatedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((name) => name !== categoryName)
      : [...selectedCategories, categoryName];

    setSelectedCategories(updatedCategories);
    onCategoryClick(updatedCategories); // Przekaż zaktualizowaną listę do rodzica
  };

  // Funkcja rekurencyjnego renderowania kategorii i podkategorii
  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => (
      <div key={category.categoryId} className={`ml-${level * 4}`}> {/* Dodanie wcięcia */}
        <div className="flex items-center p-1">
          <input
            type="checkbox"
            id={category.categoryId}
            className="border rounded-xl w-4 h-4 accent-black text-black"
            checked={selectedCategories.includes(category.name)}
            onChange={() => handleCheckboxChange(category.name)}
          />
          <label
            htmlFor={category.categoryId}
            className="ml-2 text-[14px] text-gray-600"
          >
            {category.name}
          </label>
        </div>
        {/* Renderowanie podkategorii, jeśli istnieją */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="ml-4">
            {renderCategories(category.subcategories, level + 1)}
          </div>
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
