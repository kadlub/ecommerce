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
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isConditionOpen, setIsConditionOpen] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const category = useMemo(() => {
    return categoryData?.find(
      (element) => element?.name?.toLowerCase() === categoryType?.toLowerCase()
    );
  }, [categoryData, categoryType]);

  useEffect(() => {
    if (categoryType) {
      dispatch(setLoading(true));
      axios
        .get(`${API_BASE_URL}/api/categories/by-name/${categoryType}/subcategories`)
        .then((res) => {
          setSubcategories(res.data || []);
          setSelectedCategories([categoryType]);
          fetchFilteredProducts([categoryType]); // eslint-disable-line react-hooks/exhaustive-deps
        })
        .catch((err) => {
          console.error('Błąd podczas pobierania podkategorii:', err);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  }, [categoryType, dispatch]);

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

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleConditionChange = (condition) => {
    setSelectedCondition(condition);
  };

  const handleApplyFilters = () => {
    fetchFilteredProducts(selectedCategories);
  };

  return (
    <div className="flex flex-col">
      {/* Górny pasek z przyciskiem */}
      <div className="w-full flex justify-between items-center p-4">
        <button
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          className="flex items-center bg-white text-gray-800 py-2 px-8 rounded-md shadow border border-black hover:bg-gray-100"
        >
          <FilterIcon className="w-5 h-5 mr-4" />
          {isFiltersVisible ? 'Ukryj filtry' : 'Pokaż filtry'}
        </button>
      </div>

      <div className="flex">
        {/* Panel filtrów */}
        {isFiltersVisible && (
          <div className="w-1/4 p-4 bg-white border border-black rounded-lg shadow-md ml-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtry</h2>

              {/* Kategorie */}
              <div className="mb-6">
                <div
                  className="flex justify-between items-center cursor-pointer border-b pb-2"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <p className="text-md font-medium text-gray-800">Kategorie</p>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isCategoryOpen && (
                  <Categories types={subcategories} onCategoryClick={handleCategoryChange} />
                )}
              </div>

              {/* Filtr cenowy */}
              <div className="mb-6">
                <div
                  className="flex justify-between items-center cursor-pointer border-b pb-2"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                  <p className="text-md font-medium text-gray-800">Zakres cenowy</p>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isPriceOpen && <PriceFilter onPriceChange={handlePriceChange} />}
              </div>

              {/* Filtr stanu */}
              <div className="mb-6">
                <div
                  className="flex justify-between items-center cursor-pointer border-b pb-2"
                  onClick={() => setIsConditionOpen(!isConditionOpen)}
                >
                  <p className="text-md font-medium text-gray-800">Stan</p>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${isConditionOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isConditionOpen && (
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-3">
                      <span className="w-4 h-4 border rounded-full flex items-center justify-center bg-white shadow-inner">
                        {selectedCondition === 'Nowy' && <span className="w-2 h-2 bg-black rounded-full"></span>}
                      </span>
                      <input
                        type="radio"
                        name="condition"
                        value="Nowy"
                        checked={selectedCondition === 'Nowy'}
                        onChange={() => handleConditionChange('Nowy')}
                        className="hidden"
                      />
                      Nowy
                    </label>
                    <label className="flex items-center gap-3">
                      <span className="w-4 h-4 border rounded-full flex items-center justify-center bg-white shadow-inner">
                        {selectedCondition === 'Używany' && <span className="w-2 h-2 bg-black rounded-full"></span>}
                      </span>
                      <input
                        type="radio"
                        name="condition"
                        value="Używany"
                        checked={selectedCondition === 'Używany'}
                        onChange={() => handleConditionChange('Używany')}
                        className="hidden"
                      />
                      Używany
                    </label>
                    <label className="flex items-center gap-3">
                      <span className="w-4 h-4 border rounded-full flex items-center justify-center bg-white shadow-inner">
                        {selectedCondition === null && <span className="w-2 h-2 bg-black rounded-full"></span>}
                      </span>
                      <input
                        type="radio"
                        name="condition"
                        value=""
                        checked={selectedCondition === null}
                        onChange={() => handleConditionChange(null)}
                        className="hidden"
                      />
                      Wszystkie
                    </label>
                  </div>
                )}
              </div>

              {/* Przycisk Zatwierdź */}
              <button
                onClick={handleApplyFilters}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                style={{ backgroundColor: '#123456' }}
              >
                Zatwierdź
              </button>
            </div>
          </div>
        )}

        {/* Lista produktów */}
        <div className={`w-${isFiltersVisible ? '3/4' : 'full'} p-4 -mt-4`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
