import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FilterIcon from '../../components/common/FilterIcon';
import Categories from '../../components/Filters/Categories';
import PriceFilter from '../../components/Filters/PriceFilter';
import ProductCard from './ProductCard';
import { getAllProductsByCategoryName } from '../../api/fetchProducts';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';

const ProductListPage = () => {
  const { categoryType } = useParams(); // Wyciągamy "categoryType" z URL
  const categoryData = useSelector((state) => state?.categoryState?.categories); // Ładujemy dane kategorii z Redux
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  // Dopasowanie `categoryType` do kategorii z bazy danych
  const category = useMemo(() => {
    return categoryData?.find(
      (element) => element?.name?.toLowerCase() === categoryType?.toLowerCase()
    );
  }, [categoryData, categoryType]);

  // Pobieranie subkategorii
  const subcategories = useMemo(() => {
    return categoryData?.filter((cat) => cat.parent_category_id === category?.category_id) || [];
  }, [category, categoryData]);

  // Pobieranie produktów po `category_id`
  useEffect(() => {
    if (!categoryType) return;
    dispatch(setLoading(true));
    getAllProductsByCategoryName(categoryType) // Zmieniamy metodę na nową
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [categoryType, dispatch]);


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
            <Categories types={subcategories} />
            <hr />
          </div>
          {/* Price Filter */}
          <div>
            <PriceFilter />
          </div>
        </div>

        {/* Products Panel */}
        <div className="p-[15px] w-[80%]">
          <p className="text-black text-lg">{category?.description}</p>
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
            {products?.map((item, index) => (
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
