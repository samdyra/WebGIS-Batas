import React from 'react';

const Card: React.FC = () => {
  return (
    <div className=" hover:cursor-pointer relative flex flex-col mt-6 text-gray-700 bg-white hover:border hover:border-main-green-dark transition shadow-md bg-clip-border rounded-xl w-96">
      <div className="relative h-fit mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
        <img
          src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80"
          alt="card-image"
        />
      </div>
      <div className="p-6">
        <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          UI/UX Review Check
        </h5>
        <p className="block font-sans text-sm antialiased font-light leading-relaxed text-inherit">
          The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can
          enjoy the main night life in Barcelona.
        </p>
      </div>
      <div className="p-6 pt-0">
        <button
          className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-main-green-dark text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          type="button"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default Card;
