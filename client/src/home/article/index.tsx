import React, { useEffect, useState } from 'react';
// Import Swiper React components
import Card from './card';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import VerticalSlider from './verticalSlider';
// import required modules

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
      <div className="flex  flex-col lg:flex-row items-start  justify-center">
        <div className=" w-full lg:w-3/4  ">
          <div className=" flex w-full justify-between max-w-screen-lg mx-auto text-center pl-5 ">
            <h2 className=" text-xl font-bold text-gray-700 lg:text-2xl">Popular</h2>
          </div>
          <div className="flex pt-10 gap-5 lg:flex-row flex-col  ">
            {Array.from({ length: screenWidth > 1280 ? 3 : screenWidth < 500 ? 1 : 2 }).map((_, index) => (
              <div key={index} className="  w-fit flex items-center justify-center ">
                <Card />
              </div>
            ))}
          </div>
        </div>
        <div className=" w-full lg:w-1/4 mt-14 lg:mt-0">
          <div className=" flex w-full justify-start lg:justify-end max-w-screen-lg mx-auto text-center lg:pl-10 lg:mb-5 xl:mb-10">
            <h2 className=" text-xl font-bold text-gray-700 lg:text-2xl lg:pr-10">Recent</h2>
          </div>
          <VerticalSlider slideNumber={screenWidth > 1200 || screenWidth < 500 ? 4 : 3} />
        </div>
      </div>
    </div>
  );
}
