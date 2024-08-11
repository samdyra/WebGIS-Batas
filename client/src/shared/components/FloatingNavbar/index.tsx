'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '../../../lib/utils';
import logo from '/logo-pemotda.png';

const FloatingNav = ({ className }: { className?: string }) => {
  const { scrollYProgress } = useScroll();
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => setIsExpanded(!isExpanded);
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn('  fixed top-0 inset-x-0    z-[5000] ', className)}
      >
        <div className="bg-white">
          <div
            className={`fixed top-0 mt-16 bg-white inset-x-0 p-4 transition-transform transform bg-none z-10 ${
              isExpanded ? 'translate-y-0' : '-translate-y-full hidden'
            }`}
          >
            <ul className="flex flex-col p-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 text-main-green rounded  md:hover:bg-transparent md:hover:text-main-green-dark md:p-0 font-semibold"
                  aria-current="page"
                >
                  Laman Utama
                </a>
              </li>
              <li>
                <a
                  href="/webgis"
                  className="block py-2 px-3 text-main-green rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-main-green-dark md:p-0 font-semibold"
                >
                  WebGIS
                </a>
              </li>
            </ul>
          </div>
          <nav className={`absolute  w-full top-0 start-0  shadow-inner z-20  bg-white ${className}`}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse ">
                <img src={logo} className="h-8" alt="Biro Pemotda Logo" />
                <span className="text-main-green self-center text-2xl font-bold whitespace-nowrap hidden sm:block">
                  SIMBAD
                </span>
              </a>
              <div className="flex">
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                  <button
                    type="button"
                    className="text-white bg-main-green hover:bg-main-green-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center "
                  >
                    Lapor Pak!
                  </button>
                  <button
                    onClick={handleExpand}
                    data-collapse-toggle="navbar-sticky"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
                    aria-controls="navbar-sticky"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 17 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  className="items-center mr-12 justify-between hidden w-full md:flex md:w-auto md:order-1"
                  id="navbar-sticky "
                >
                  <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
                    <li>
                      <a
                        href="/"
                        className="block py-2 px-3 text-main-green rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-main-green-dark md:p-0 font-semibold"
                        aria-current="page"
                      >
                        Laman Utama
                      </a>
                    </li>
                    <li>
                      <a
                        href="/webgis"
                        className="block py-2 px-3 text-main-green rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-main-green-dark md:p-0 font-semibold"
                      >
                        WebGIS
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;
