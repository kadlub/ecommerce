import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FilterIcon from '../../components/common/FilterIcon';
import Categories from '../../components/Filters/Categories';
import PriceFilter from '../../components/Filters/PriceFilter';
import ProductCard from './ProductCard';
import axios from 'axios';
import { API_BASE_URL } from '../../api/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';

const ProductListPage = () => {
  const { categoryType } = useParams();
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 10, max: 1000 });
  const [selectedCondition, setSelectedCondition] = useState(null); // Dodajemy stan dla warunku

  // Dopasowanie kategorii na podstawie URL
  const category = useMemo(() => {
    return categoryData?.find(
      (element) => element?.name?.toLowerCase() === categoryType?.toLowerCase()
    );
  }, [categoryData, categoryType]);

  // Pobieranie podkategorii dla kategorii głównej i ustawienie domyślnych filtrów
  useEffect(() => {
    if (categoryType) {
      dispatch(setLoading(true));
      axios
        .get(`${API_BASE_URL}/api/categories/by-name/${categoryType}/subcategories`)
        .then((res) => {
          setSubcategories(res.data || []);
          setSelectedCategories([categoryType]); // Domyślnie zaznaczamy kategorię główną
          fetchFilteredProducts([categoryType]); // Pobierz produkty dla kategorii głównej
        })
        .catch((err) => {
          console.error('Błąd podczas pobierania podkategorii:', err);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  }, [categoryType, dispatch]);

  // Pobieranie produktów z filtrowaniem
  const fetchFilteredProducts = (categoriesToFilter) => {
    dispatch(setLoading(true));
    axios
      .get(`${API_BASE_URL}/api/products/filter`, {
        params: {
          categoryNames: categoriesToFilter.join(', '),
          priceMin: priceRange.min,
          priceMax: priceRange.max,
          condition: selectedCondition,
        },
      })
      .then((res) => {
        setFilteredProducts(res.data || []);
      })
      .catch((err) => {
        console.error('Błąd podczas filtrowania produktów:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  // Obsługa zmiany zakresu ceny
  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  // Obsługa wyboru kategorii
  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  // Obsługa wyboru stanu
  const handleConditionChange = (condition) => {
    setSelectedCondition(condition);
  };

  // Wywołanie filtrów po kliknięciu przycisku "Zatwierdź"
  const handleApplyFilters = () => {
    fetchFilteredProducts(selectedCategories);
  };

  return (
    <div>
      <div className="flex">
        {/* Panel filtrów */}
        <div className="w-[20%] p-[10px] border rounded-lg m-[20px]">
          <div className="flex justify-between">
            <p className="text-[16px] text-gray-600">Filters</p>
            <FilterIcon />
          </div>
          {/* Podkategorie */}
          <div>
            <p className="text-[16px] text-black mt-5">Subcategories</p>
            <Categories types={subcategories} onCategoryClick={handleCategoryChange} />
            <hr />
          </div>
          {/* Filtr cenowy */}
          <div>
            <PriceFilter onPriceChange={handlePriceChange} />
          </div>
          {/* Filtr stanu */}
          <div className="mt-5">
            <p className="text-[16px] text-black">Stan</p>
            <div className="flex flex-col mt-2">
              <label>
                <input
                  type="radio"
                  name="condition"
                  value="Nowy"
                  checked={selectedCondition === 'Nowy'}
                  onChange={() => handleConditionChange('Nowy')}
                  className="mr-2"
                />
                Nowy
              </label>
              <label className="mt-2">
                <input
                  type="radio"
                  name="condition"
                  value="Używany"
                  checked={selectedCondition === 'Używany'}
                  onChange={() => handleConditionChange('Używany')}
                  className="mr-2"
                />
                Używany
              </label>
              <label className="mt-2">
                <input
                  type="radio"
                  name="condition"
                  value=""
                  checked={selectedCondition === null}
                  onChange={() => handleConditionChange(null)}
                  className="mr-2"
                />
                Wszystkie
              </label>
            </div>
          </div>
          {/* Przycisk Zatwierdź */}
          <div className="mt-4">
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Zatwierdź
            </button>
          </div>
        </div>

        {/* Lista produktów */}
        <div className="p-[15px] w-[80%]">
          <p className="text-black text-lg">{category?.description}</p>
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
            {filteredProducts.map((item, index) => (
              <ProductCard
                key={item?.productId + '_' + index}
                {...item}
                title={item?.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
