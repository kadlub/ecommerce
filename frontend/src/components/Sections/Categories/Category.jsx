import React from 'react';
import SectionHeading from '../SectionsHeading/SectionHeading';
import Card from '../../Card/Card';

const Category = ({ name, subcategories }) => {
  return (
    <>
      <SectionHeading title={name} />
      <div className='flex items-center px-8 flex-wrap'>
        {subcategories && subcategories.map((subcategory, index) => (
          <Card
            key={subcategory.categoryId}
            title={subcategory.name}
            description={subcategory.description}
            imagePath={subcategory.image || '/default-image.jpg'} // Opcjonalny obraz
            actionArrow={true}
            height={'240px'}
            width={'200px'}
          />
        ))}
      </div>
      {/* Rekursja dla kolejnych poziomów podkategorii */}
      {subcategories && subcategories.map((subcategory) => (
        <Category
          key={subcategory.categoryId}
          name={subcategory.name}
          subcategories={subcategory.subcategories} // Przekazujemy zagnieżdżone podkategorie
        />
      ))}
    </>
  );
};

export default Category;
