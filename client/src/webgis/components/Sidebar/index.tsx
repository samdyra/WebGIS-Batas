/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { memo, useState } from 'react';
import s from './sidebar.module.scss';

import openlogo from '../../../../public/openlogo.svg';

type MenuItemsType = {
  icon: () => React.JSX.Element;
  label: string;
}[];

interface IProps {
  children?: React.ReactNode;
  menuItems?: MenuItemsType;
  setMenuIndex: React.Dispatch<React.SetStateAction<number>>;
  menuIndex: number;
}

const SideBar = (props: IProps) => {
  const { setMenuIndex, menuIndex } = props;
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen2 = () => setIsOpen2(!isOpen2);
  const handleOpen = () => setIsOpen(!isOpen);

  const handleOpenIndex = (index: number, isSelected: boolean) => {
    setMenuIndex(index);

    if (!isSelected) {
      setIsOpen(true);
    }

    if (isSelected) {
      setIsOpen(!isOpen);
    }
  };

  const styleSideMenuActive = {
    width: '390px',
    left: isOpen2 ? '100px' : '200px',
  };
  const styleSideMenu = { width: '100px', left: isOpen2 ? '0' : '100px' };
  const wrapper2Style = isOpen ? styleSideMenuActive : styleSideMenu;

  return (
    <>
      <div className={`${s.wrapper} border-t-2`} style={{ width: isOpen2 ? '100px' : '200px' }}>
        {props.menuItems?.map((item, index) => {
          const isSelected = index === menuIndex;

          if (isOpen2) {
            if (isSelected) {
              return (
                <div className="mx-auto mb-5" key={item.label}>
                  <div
                    className={`${s.logostyleactive} text-bold mx-auto flex w-fit flex-col items-center justify-center border-main-yellow p-[4px]`}
                  >
                    <div className="cursor-pointer" onClick={() => handleOpenIndex(index, isSelected)}>
                      {<item.icon />}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="mx-auto mb-5" key={item.label}>
                <div
                  className={`${s.logostyle} text-bold mx-auto flex w-fit flex-col items-center justify-center p-[4px]`}
                  key={item.label}
                >
                  <div className="cursor-pointer" onClick={() => handleOpenIndex(index, isSelected)}>
                    {<item.icon />}
                  </div>
                </div>
              </div>
            );
          }

          if (isSelected) {
            return (
              <button
                className="text-bold flex  w-full items-center justify-center bg-blue-500 py-2 font-semibold text-white"
                key={item.label}
                onClick={() => handleOpenIndex(index, isSelected)}
              >
                {item.label}
              </button>
            );
          }

          return (
            <button
              className="flex w-full items-center justify-center py-2 font-semibold text-white hover:bg-blue-500"
              key={item.label}
              onClick={() => handleOpenIndex(index, isSelected)}
            >
              {item.label}
            </button>
          );
        })}

        <button className={s.openButton1} style={{ right: isOpen ? '-410px' : '-20px' }} onClick={handleOpen}>
          <img
            src={openlogo}
            alt="open-icon"
            width={10}
            height={10}
            className={isOpen ? s.icon1_active : s.icon1}
            loading={'lazy'}
          />
        </button>
        <button className={s.openButton2} onClick={handleOpen2}>
          <img
            src={openlogo}
            alt="open-icon"
            className={!isOpen2 ? s.icon1_active : s.icon1}
            width={10}
            height={10}
            loading={'lazy'}
          />
        </button>
      </div>
      <div className={`border-r-2 border-t-2 ${s.wrapper2 ?? ''}`} style={wrapper2Style}>
        {isOpen && (
          <h1 className="mb-2 pl-4 text-2xl font-bold text-main-green ">{`${props?.menuItems?.[menuIndex]?.label}`}</h1>
        )}

        {isOpen ? props.children : null}
      </div>
    </>
  );
};

export default memo(SideBar);
