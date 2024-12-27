import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SectionHeading from '../../components/Sections/SectionsHeading/SectionHeading';
import ProductCard from '../ProductListPage/ProductCard';
import Rating from '../../components/Rating/Rating';
import { getAllProducts } from '../../api/fetchProducts';

const ProductDetails = () => {
  const { product } = useLoaderData() || {}; // Ładowanie danych z react-router loadera
  const [image, setImage] = useState(product?.imageUrl || '/placeholder.jpg'); // Domyślny obrazek
  const [breadCrumbLinks, setBreadCrumbLink] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Pobieranie pełnej ścieżki kategorii
  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      const categoryPath = [
        { title: 'Sklep', path: '/' },
        ...(product?.categoryPath || []).map((cat) => ({
          title: cat.name,
          path: `/categories/${cat.id}`
        })),
        { title: product?.name || 'Produkt' }
      ];
      setBreadCrumbLink(categoryPath);
    };
    fetchBreadcrumbs();
  }, [product]);

  // Pobieranie podobnych produktów
  useEffect(() => {
    if (product?.categoryId) {
      getAllProducts(product?.categoryId).then((res) => {
        const excludedProducts = res?.filter((item) => item?.productId !== product?.productId);
        setSimilarProducts(excludedProducts || []);
      });
    }
  }, [product?.categoryId, product?.productId]);

  return (
    <>
      <div className="flex flex-col md:flex-row px-10">
        {/* Sekcja obrazu */}
        <div className="w-[100%] lg:w-[50%] md:w-[40%]">
          <div className="w-full flex justify-center md:pt-0 pt-10">
            <img
              src={image}
              className="h-full w-full max-h-[520px] border rounded-lg cursor-pointer object-cover"
              alt={product?.name || 'Produkt'}
            />
          </div>
        </div>
        {/* Szczegóły produktu */}
        <div className="w-[60%] px-10">
          <Breadcrumb links={breadCrumbLinks} />
          <p className="text-3xl pt-4">{product?.name || 'Nazwa produktu'}</p>
          <Rating rating={product?.rating || 0} />
          <p className="text-xl bold py-2">${product?.price || 'Cena niedostępna'}</p>
          <p className="py-4">{product?.description || 'Brak opisu produktu.'}</p>
          <p className="py-2 text-gray-700">Stan: {product?.condition || 'Nieznany'}</p>
          {/* Przyciski */}
          <div className="flex space-x-4 py-4">
            <button
              onClick={() => console.log('Dodano do koszyka')}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Dodaj do koszyka
            </button>
            <button
              onClick={() => console.log('Dodano do ulubionych')}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              Dodaj do ulubionych
            </button>
          </div>
        </div>
      </div>
      {/* Opis produktu */}
      <SectionHeading title={'Opis produktu'} />
      <div className="md:w-[50%] w-full p-2">
        <p className="px-8">{product?.description || 'Brak opisu produktu.'}</p>
      </div>
      {/* Podobne produkty */}
      <SectionHeading title={'Podobne produkty'} />
      <div className="flex px-10">
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 px-2 pb-10">
          {similarProducts?.map((item, index) => (
            <ProductCard key={index} {...item} />
          ))}
          {!similarProducts?.length && <p>Brak podobnych produktów.</p>}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
