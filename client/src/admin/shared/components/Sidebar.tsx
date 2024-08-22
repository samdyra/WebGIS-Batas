import React, { useState } from 'react';
import { AiOutlineCloudUpload, AiOutlineLogout } from 'react-icons/ai';
import { LuGroup } from 'react-icons/lu';

import { FaTable, FaBook, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';
import { FaMap } from 'react-icons/fa';
import { MdArticle } from 'react-icons/md';
import { FaDatabase } from 'react-icons/fa';
import { IoLayers } from 'react-icons/io5';

type Props = {
  setActiveTab: (tab: string) => void;
  activeTab: string;
};

const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const buttonClass = (tab: string) => `
    flex items-center w-full p-2 rounded 
    ${activeTab === tab ? 'bg-main-green text-white' : 'text-white hover:bg-main-green'}
    transition-all duration-300 ease-in-out
    ${isCollapsed ? 'justify-center' : 'justify-start'}
  `;

  return (
    <div
      className={`
        bg-main-green-dark text-white h-screen flex flex-col
        transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-[100px]' : 'w-64'}
      `}
    >
      <div className="flex-grow p-5">
        <h2 className={`text-2xl font-bold mb-5 ${isCollapsed ? 'hidden' : 'block'}`}>Admin Panel</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('documentation')} className={buttonClass('documentation')}>
            <FaBook size={18} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>Documentation</span>
          </button>
          <button onClick={() => setActiveTab('data')} className={buttonClass('data')}>
            <FaDatabase size={17} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>Data Management</span>
          </button>
          <button onClick={() => setActiveTab('layer')} className={buttonClass('layer')}>
            <IoLayers size={21} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>Layer Management</span>
          </button>
          <button onClick={() => setActiveTab('group')} className={buttonClass('group')}>
            <LuGroup size={22} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>Layer Groupings</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={buttonClass('reports')}>
            <IoIosWarning size={18} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>Report Management</span>
          </button>
          <button onClick={() => setActiveTab('articles')} className={buttonClass('articles')}>
            <MdArticle size={18} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>Articles</span>
          </button>
          <button onClick={() => setActiveTab('user')} className={buttonClass('user')}>
            <FaUser size={18} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>User Access</span>
          </button>
        </nav>
      </div>
      <div className="p-5 space-y-2">
        <a
          href="/webgis"
          className={`
            flex items-center w-full p-2 rounded text-white hover:bg-main-green transition-colors
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          <FaMap size={18} className={isCollapsed ? '' : 'mr-2'} />
          <span className={isCollapsed ? 'hidden' : 'ml-2'}>Back To Map</span>
        </a>
        <button
          onClick={toggleSidebar}
          className={`
            flex items-center w-full p-2 rounded text-white hover:bg-main-green transition-colors
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          {isCollapsed ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
          <span className={isCollapsed ? 'hidden' : 'ml-2'}>{isCollapsed ? 'Expand' : 'Collapse'}</span>
        </button>
        <button
          className={`
            flex items-center w-full p-2 rounded 
            text-white hover:bg-red-600
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          <AiOutlineLogout size={18} className={isCollapsed ? '' : 'mr-2'} />
          <span className={isCollapsed ? 'hidden' : 'block'}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
