import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilterIcon from '../../components/common/FilterIcon';
import Categories from '../../components/Filters/Categories';
import PriceFilter from '../../components/Filters/PriceFilter';
import ProductCard from './ProductCard';
import { getAllProductsByCategoryName } from '../../api/fetchProducts';
import { getSubcategoriesByCategoryName } from '../../api/fetchCategories';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';

const ProductListPage = () => {
  const { categoryType } = useParams();
  const navigate = useNavigate();
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 10, max: 1000 });

  // Dopasowanie `categoryType` do kategorii z bazy danych
  const category = useMemo(() => {
    return categoryData?.find(
      (element) => element?.name?.toLowerCase() === categoryType?.toLowerCase()
    );
  }, [categoryData, categoryType]);

  // Pobieranie podkategorii na podstawie nazwy kategorii
  useEffect(() => {
    if (categoryType) {
      dispatch(setLoading(true));
      getSubcategoriesByCategoryName(categoryType)
        .then((res) => {
          setSubcategories(res); // Ustawiamy podkategorie
        })
        .catch((err) => {
          console.error('Błąd podczas pobierania podkategorii:', err);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      console.warn("Nie znaleziono kategorii dla:", categoryType);
    }
  }, [categoryType, dispatch]);

  // Pobieranie produktów na podstawie nazwy kategorii
  useEffect(() => {
    if (!categoryType) return;
    dispatch(setLoading(true));
    getAllProductsByCategoryName(categoryType)
      .then((res) => {
        setProducts(res);
        setFilteredProducts(res); // Początkowe filtrowane produkty
      })
      .catch((err) => {
        console.error('Błąd podczas pobierania produktów:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [categoryType, dispatch]);

  // Obsługa zmiany zakresu ceny
  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    const filtered = products.filter(
      (product) => product.price >= min && product.price <= max
    );
    setFilteredProducts(filtered);
  };

  // Funkcja obsługująca kliknięcie w podkategorię
  const handleCategoryClick = (categoryName) => {
    navigate(`/categories/${categoryName}`);
  };

  return (
    <div>
      <div className="flex">
        {/* Filters Panel */}
        <div className="w-[20%] p-[10px] border rounded-lg m-[20px]">
          <div className="flex justify-between">
            <p className="text-[16px] text-gray-600">Filters</p>
            <FilterIcon />
          </div>
          {/* Subcategories */}
          <div>
            <p className="text-[16px] text-black mt-5">Subcategories</p>
            <Categories types={subcategories} onCategoryClick={handleCategoryClick} />
            <hr />
          </div>
          {/* Price Filter */}
          <div>
            <PriceFilter onPriceChange={handlePriceChange} />
          </div>
        </div>

        {/* Products Panel */}
        <div className="p-[15px] w-[80%]">
          <p className="text-black text-lg">{category?.description}</p>
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
            {filteredProducts?.map((item, index) => (
              <ProductCard
                key={item?.id + '_' + index}
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
