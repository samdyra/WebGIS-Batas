import React, { useRef, useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from './card';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import VerticalSlider from './verticalSlider';
// import required modules
import { Pagination } from 'swiper/modules';

export default function Article() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="w-4/5  mx-auto  my-24 ">
      <h2 className=" text-2xl my-10 font-bold text-black lg:text-4xl text-center">Article</h2>
      <div className="flex items-start  justify-center">
        <div className="w-3/5 ">
          <div className=" flex w-full justify-between max-w-screen-lg mx-auto text-center pl-10 ">
            <h2 className=" text-2xl font-bold text-gray-700 lg:text-2xl">Popular</h2>
          </div>
          <Swiper
            slidesPerView={screenWidth <= 1640 ? 2 : 3}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper   pb-10 pt-8 px-5 "
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <SwiperSlide key={index} className="  w-fit flex items-center justify-center ">
                <Card />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-2/5 ">
          <div className=" flex w-full justify-end max-w-screen-lg mx-auto text-center pl-10 ">
            <h2 className=" text-2xl font-bold text-gray-700 lg:text-2xl pr-10">Recent Release</h2>
          </div>
          <VerticalSlider />
        </div>
      </div>
    </div>
  );
}
