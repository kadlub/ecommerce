import React from 'react'
import SectionHeading from './SectionsHeading/SectionHeading'
import Card from '../Card/Card';
import Guitars from '../../assets/img/guitar-category.png'
import Carousel from 'react-multi-carousel';
import { responsive } from '../../utils/Section.constants';
import './NewArrivals.css';

const items = [{
  'title': 'Guitars',
  imagePath: Guitars
}];

const NewArrivals = () => {
  return (
    <>
      <SectionHeading title={'Najciekawsze'} />
      <Carousel
        responsive={responsive}
        autoPlay={false}
        swipeable={true}
        draggable={false}
        showDots={false}
        infinite={false}
        partialVisible={false}
        itemClass={'react-slider-custom-item'}
        className='px-8'
      >
        {items && items?.map((item, index) => <Card key={item?.title + index} title={item.title} imagePath={item.imagePath} />)}

      </Carousel>
    </>
  )
}

export default NewArrivals