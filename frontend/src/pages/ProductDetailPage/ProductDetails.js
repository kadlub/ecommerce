import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SectionHeading from '../../components/Sections/SectionsHeading/SectionHeading';
import ProductCard from '../ProductListPage/ProductCard';
import Rating from '../../components/Rating/Rating';
import { getAllProducts } from '../../api/fetchProducts';
import { addItemToCartAction } from '../../store/actions/cartAction';

const ProductDetails = () => {
  const { product } = useLoaderData() || {}; // Ładowanie danych z react-router loadera
  const dispatch = useDispatch();

  const imageBaseUrl = "http://localhost:8080/api/uploads/products/";
  const fullImageUrls = product?.imageUrls?.map((url) => imageBaseUrl + url);

  const [selectedImage, setSelectedImage] = useState(
    fullImageUrls?.length ? fullImageUrls[0] : '/placeholder.jpg'
  );
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal dla powiększenia obrazu
  const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Breadcrumbs
  useEffect(() => {
    const arrayLinks = [
      { title: 'Sklep', path: '/' },
      product?.categoryName
        ? { title: product?.categoryName, path: `/categories/${product?.categoryId}` }
        : { title: 'Kategoria', path: '/categories' },
    ];
    setBreadCrumbLinks(arrayLinks.filter(Boolean)); // Filtrowanie, aby usunąć puste wartości
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

  // Obsługa dodawania do koszyka
  const handleAddToCart = () => {
    const cartItem = {
      productId: product?.productId,
      name: product?.name,
      price: product?.price,
      thumbnail: fullImageUrls?.[0] || '/placeholder.jpg',
      quantity: 1,
      subTotal: product?.price,
    };
    dispatch(addItemToCartAction(cartItem));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row px-10">
        {/* Galeria zdjęć */}
        <div className="w-[100%] lg:w-[50%] md:w-[40%]">
          <div className="w-full flex justify-center md:pt-0 pt-10">
            <img
              src={selectedImage}
              className="h-full w-full max-h-[520px] border rounded-lg cursor-pointer object-contain"
              alt={product?.name || 'Produkt'}
              onClick={() => setIsModalOpen(true)} // Otwórz modal po kliknięciu na obraz
            />
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {fullImageUrls?.map((url, index) => (
              <img
                key={index}
                src={url}
                className="h-20 w-20 border rounded-lg cursor-pointer object-cover"
                alt={`Miniatura ${index + 1}`}
                onClick={() => setSelectedImage(url)} // Zmień wybrane zdjęcie
              />
            ))}
          </div>
        </div>
        {/* Szczegóły produktu */}
        <div className="w-[60%] px-10">
          <Breadcrumb links={breadCrumbLinks} />
          <p className="text-3xl pt-4">{product?.name || 'Nazwa produktu'}</p>
          <Rating rating={product?.rating || 0} />
          <p className="text-xl bold py-2">${product?.price || 'Cena niedostępna'}</p>
          <p className="text-sm py-1 text-gray-600">Stan: {product?.condition || 'Nieznany'}</p>
          <p className="text-sm py-1 text-gray-600">Sprzedawca: {product?.sellerName || 'Nieznany'}</p>
          <p className="py-4">{product?.description || 'Brak opisu produktu.'}</p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
      {/* Modal dla powiększonego obrazu */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={selectedImage}
            className="max-h-full max-w-full object-contain"
            alt="Powiększony obraz"
          />
        </div>
      )}
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
