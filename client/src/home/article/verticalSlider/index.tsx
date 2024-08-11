// import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

// import required modules

function Card() {
  return (
    <div className="max-w-sm w-full lg:max-w-20 lg:flex">
      {/* <div
        className="h-48 lg:h-auto lg:w-10 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        title="Woman holding a mug"
      ></div> */}
      <div className="border-r border-b border-l  hover:border-main-green-dark transition  border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-base mb-2">Can coffee make you a better developer?</div>
          <p className="text-gray-700 text-base w-full">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis
            eaque, exercitationem praesentium nihil.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Article() {
  return (
    <Swiper
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      slidesPerView={4}
      spaceBetween={70}
      className="mySwiper ml-0 mr-0  w-full max-h-[600px] h-[550px]     lg:mt-0  pr-7 lg:px-8 py-10 "
      direction={'vertical'}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <SwiperSlide key={index} className="  max-h-52 h-52 w-full  flex items-center justify-center ">
          <div className=" hover:cursor-pointer w-full  h-fit text-gray-700 bg-white shadow-md bg-clip-border rounded-xl hover:border  hover:border-main-green-dark transition ">
            <div className="p-5">
              <h5 className="block mb-2 font-sans text-sm antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                UI/UX Review Check
              </h5>
              <p className="block font-sans text-xs antialiased font-light leading-relaxed text-inherit">
                The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you
                can
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
