import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SectionHeading from '../../components/Sections/SectionsHeading/SectionHeading';
import ProductCard from '../ProductListPage/ProductCard';
import Rating from '../../components/Rating/Rating';
import { getAllProducts } from '../../api/fetchProducts';

const ProductDetails = () => {
  const { product } = useLoaderData() || {};
  const [image, setImage] = useState(product?.imageUrl || '');
  const [breadCrumbLinks, setBreadCrumbLink] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Breadcrumbs
  useEffect(() => {
    const arrayLinks = [
      { title: 'Sklep', path: '/' },
      { title: product?.categoryName || 'Kategoria', path: `/categories/${product?.categoryId}` }
    ];
    setBreadCrumbLink(arrayLinks);
  }, [product]);

  // Fetch similar products by category
  useEffect(() => {
    if (product?.categoryId) {
      getAllProducts(product?.categoryId).then((res) => {
        const excludedProducts = res?.filter((item) => item?.id !== product?.id);
        setSimilarProducts(excludedProducts || []);
      });
    }
  }, [product?.categoryId, product?.id]);

  return (
    <>
      <div className="flex flex-col md:flex-row px-10">
        {/* Image Section */}
        <div className="w-[100%] lg:w-[50%] md:w-[40%]">
          <div className="w-full flex justify-center md:pt-0 pt-10">
            <img
              src={image}
              className="h-full w-full max-h-[520px] border rounded-lg cursor-pointer object-cover"
              alt={product?.name}
            />
          </div>
        </div>
        {/* Product Details Section */}
        <div className="w-[60%] px-10">
          <Breadcrumb links={breadCrumbLinks} />
          <p className="text-3xl pt-4">{product?.name}</p>
          <Rating rating={product?.rating} />
          <p className="text-xl bold py-2">${product?.price}</p>
          <p className="py-4">{product?.description}</p>
        </div>
      </div>
      {/* Product Description */}
      <SectionHeading title={'Opis produktu'} />
      <div className="md:w-[50%] w-full p-2">
        <p className="px-8">{product?.description}</p>
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
