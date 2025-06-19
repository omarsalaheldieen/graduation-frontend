import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import MenCategory from '../../assets/images/mensCategory.jpg';
import WomenCategory from '../../assets/images/womenCategory.jpeg';
import FurnitureCategory from '../../assets/images/furniture-categories.png';
import ElectronicsCategory from '../../assets/images/wholesale-electronics.jpeg';
import BeautyCategory from '../../assets/images/beauty.jpg';
import GroceriesCategory from '../../assets/images/Groceries.jpg';

const categories = [
  { to: 'women', img: WomenCategory, label: 'Women' },
  { to: 'men', img: MenCategory, label: 'Men' },
  { to: 'electronics', img: ElectronicsCategory, label: 'Electronics' },
  { to: 'furniture', img: FurnitureCategory, label: 'Furniture' },
  { to: 'beauty', img: BeautyCategory, label: 'Beauty' },
  { to: 'groceries', img: GroceriesCategory, label: 'Groceries' },
];

export default function CategorySlider() {
  return (
    <div className="py-16 px-4 bg-cream">
  <div className="max-w-6xl mx-auto relative">
    <h2 className="text-4xl font-bold text-center text-oranges mb-10 font-marker">
      Browse Popular Categories
    </h2>

   

    <Swiper
      modules={[Autoplay, Navigation, EffectCoverflow]}
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      loop
      navigation={{
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
      }}
      coverflowEffect={{
        rotate: 30,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
      }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      className="rounded-3xl"
    >
      {categories.map(({ to, img, label }) => (
        <SwiperSlide
          key={to}
          style={{ width: '300px' }}
          className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
        >
          <Link to={to}>
            <div className="relative w-full h-64">
              <img
                src={img}
                alt={label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full text-center bg-cream text-oranges py-3 text-xl font-semibold">
                {label}
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</div>

  );
}
















