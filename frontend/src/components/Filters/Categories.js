import React, { useEffect, useState } from 'react';
import { fetchCategoriesTree } from '../../api/fetchCategories'; // Zakładamy, że API istnieje

const Categories = ({ types }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Pobierz dynamiczne dane o kategoriach, jeśli `types` nie są przekazane jako props
    if (!types) {
      fetchCategoriesTree()
        .then((res) => {
          setCategories(res); // Zakładamy, że API zwraca listę kategorii
        })
        .catch((error) => {
          console.error('Błąd podczas pobierania kategorii:', error);
        });
    }
  }, [types]);

  // Użyj dynamicznych kategorii, jeśli `types` nie jest przekazane jako props
  const dataToRender = types || categories;

  return (
    <div>
      {dataToRender?.map((type) => (
        <div key={type?.categoryId} className='flex items-center p-1'>
          <input
            type='checkbox'
            name={type?.code || type?.name} // Użyj `code` lub `name` jako identyfikatora
            className='border rounded-xl w-4 h-4 accent-black text-black'
          />
          <label
            htmlFor={type?.code || type?.name}
            className='px-2 text-[14px] text-gray-600'
          >
            {type?.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Categories;
