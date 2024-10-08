// import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export interface VerticalSliderProps {
  slideNumber: number;
}

export default function Article({ slideNumber }: VerticalSliderProps) {
  return (
    <Swiper
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      slidesPerView={slideNumber}
      spaceBetween={80}
      className="mySwiper ml-0 mr-0  w-full max-h-[600px] h-[500px]     lg:mt-0  pr-7 lg:px-8 py-10 "
      direction={'vertical'}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <SwiperSlide key={index} className="  max-h-52 h-52 w-full  flex items-center justify-center ">
          <div className=" hover:cursor-pointer w-full  h-fit text-gray-700 bg-white shadow-md bg-clip-border rounded-xl hover:border  hover:border-main-green-dark transition ">
            <div className="p-3">
              <h5 className="block mb-2 font-sans text-sm antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                UI/UX Review Check
              </h5>
              <p className="block font-sans text-sm antialiased font-light leading-relaxed text-inherit">
                The place is close to Barceloneta Beach and bus stop just 2 min by
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
