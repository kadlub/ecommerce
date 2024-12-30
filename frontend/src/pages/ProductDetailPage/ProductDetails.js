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
  const { product } = useLoaderData() || {}; // Loading data from react-router loader
  const dispatch = useDispatch();

  const [image, setImage] = useState(product?.imageUrl || '/placeholder.jpg'); // Default image
  const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Setting up Breadcrumbs
  useEffect(() => {
    const arrayLinks = [
      { title: 'Sklep', path: '/' },
      product?.categoryName
        ? { title: product?.categoryName, path: `/categories/${product?.categoryId}` }
        : { title: 'Kategoria', path: '/categories' },
    ];
    setBreadCrumbLinks(arrayLinks.filter(Boolean)); // Remove empty values
  }, [product]);

  // Fetching similar products
  useEffect(() => {
    if (product?.categoryId) {
      getAllProducts(product?.categoryId).then((res) => {
        const excludedProducts = res?.filter((item) => item?.productId !== product?.productId);
        setSimilarProducts(excludedProducts || []);
      });
    }
  }, [product?.categoryId, product?.productId]);

  // Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      productId: product?.productId,
      name: product?.name,
      price: product?.price,
      thumbnail: product?.imageUrl || '/placeholder.jpg',
      quantity: 1,
      subTotal: product?.price,
    };
    dispatch(addItemToCartAction(cartItem));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row px-10">
        {/* Image Section */}
        <div className="w-[100%] lg:w-[50%] md:w-[40%]">
          <div className="w-full flex justify-center md:pt-0 pt-10">
            <img
              src={image}
              className="h-full w-full max-h-[520px] border rounded-lg cursor-pointer object-cover"
              alt={product?.name || 'Produkt'}
            />
          </div>
        </div>
        {/* Product Details Section */}
        <div className="w-[60%] px-10">
          <Breadcrumb links={breadCrumbLinks} />
          <p className="text-3xl pt-4">{product?.name || 'Nazwa produktu'}</p>
          <Rating rating={product?.rating || 0} />
          <p className="text-xl bold py-2">${product?.price || 'Cena niedostępna'}</p>
          <p className="py-4">{product?.description || 'Brak opisu produktu.'}</p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
      {/* Product Description */}
      <SectionHeading title={'Opis produktu'} />
      <div className="md:w-[50%] w-full p-2">
        <p className="px-8">{product?.description || 'Brak opisu produktu.'}</p>
      </div>
      {/* Similar Products */}
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
