import React from 'react'
import SectionHeading from './SectionsHeading/SectionHeading'
import Card from '../Card/Card';
import Guitars from '../../assets/img/guitar.jpg'
import vinyl from '../../assets/img/vinyl.png'
import Carousel from 'react-multi-carousel';
import asap from '../../assets/img/asap.jpg'
import cable from '../../assets/img/kabel.jpg'
import dj from '../../assets/img/dj.jpg'
import microphone from '../../assets/img/microphone.jpg'
import monitors from '../../assets/img/monitory.jpg'
import { responsive } from '../../utils/Section.constants';
import './Bestsellers.css';

const items = [
  {
    title: 'Gitary Elektryczne',
    imagePath: Guitars,
  },
  {
    title: 'Płyty Winylowe',
    imagePath: vinyl,
  },
  {
    title: 'Merch Artystów',
    imagePath: asap,
  },
  {
    title: 'Mikrofony',
    imagePath: microphone,
  },
  {
    title: 'Kable XLR',
    imagePath: cable,
  },
  {
    title: 'Kontrolery DJ-skie',
    imagePath: dj,
  },
  {
    title: 'Monitory studyjne',
    imagePath: monitors,
  },
];


const Bestsellers = () => {
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

export default Bestsellers;