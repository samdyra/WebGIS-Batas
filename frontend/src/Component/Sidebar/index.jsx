import React, { memo,useState } from "react";
import s from "./sidebar.module.scss";
import openlogo from "../../assets/openlogo.svg";
import tan_icon from "../../assets/tan_icon.svg";
import layer_list from "../../assets/layer_list.svg";
import active_layer from "../../assets/active_layer.svg";
import layer_sub from "../../assets/layer_sub.svg";
import remove_layer_icon from "../../assets/remove_layer_icon.svg";

const SideBar = ({
  pointClick, polygonClick, activeLayerIndexArray 
}) => {
  const [ isOpen2, setIsOpen2 ] = useState(true);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ menuIndex, setMenuIndex ] = useState(100);

  const handleOpen2 = () => setIsOpen2(!isOpen2);
  const handleOpen = () => setIsOpen(!isOpen);

  const styleSideMenuActive = { width: "250px" , left: isOpen2 ? "100px" : "200px" }
  const styleSideMenu = { width: "100px" , left: isOpen2 ? "0" : "100px" }
  const wrapper2Style = isOpen ? styleSideMenuActive : styleSideMenu;

  const menuItem = [
    {
      image: layer_list,
      name: "Layer List",
    },
    {
      image: active_layer,
      name: "Active Layer",
    },
  ]
  const LayerListsSubItem = [
    {
      name: "Point",
      function: pointClick
      
    },
    {
      name: "Polygon",
      function: polygonClick 
      
    },
  ]

  const activeLayerItem =
   LayerListsSubItem.filter((obj, index) => {
     return activeLayerIndexArray.includes(index);
   });

  const handleMenuClick = (index) => {
    if (!isOpen) {
      setIsOpen(true)
    }

    if (index === menuIndex) {
      setIsOpen(false)
      setMenuIndex(100)
    }
   
  }
  
  return(
    <>
      <div className={s.wrapper} style={{ width: isOpen2 ? "100px" : "200px" }}>
        <img src={tan_icon} className={s.tan_icon} alt="" />
        <div>
          {menuItem.map((e,index) => 
            (
              <div className={s.menuItem} key={index} 
                onClick={() => {
                  setMenuIndex(index) ;
                  handleMenuClick(index)
                }} 
                style={{ backgroundColor: menuIndex === index && "rgba(255, 255, 255, 0.34)" }} >
                <div className={isOpen2 ? s.menuIcon : s.menuIconOpen}>
                  <img src={e.image} alt="" />
                </div>
                {!isOpen2 && (
                  <div className={s.menuText} >
                    <p>{e.name}</p>
                  </div>) }
              </div>
            )
          )}
        </div>
        <button className={s.openButton1} style={{ right: isOpen ? "-270px" : "-20px" }} onClick={handleOpen}>
          <img src={openlogo} className={isOpen ? s.icon1_active : s.icon1} alt="" />
        </button>
        <button className={s.openButton2} onClick={handleOpen2} >
          <img src={openlogo} className={!isOpen2 ? s.icon1_active : s.icon1} alt="" />
        </button>
      </div>
      <div className={s.wrapper2} style={wrapper2Style}>
        {menuIndex === 0 ? (
          <>
            {LayerListsSubItem.map((e,index) => 
              (
                <div className={s.menuSubItem} key={index} onClick={() => e.function()} >
                  <p>{e.name}</p>
                  <img src={layer_sub} alt="" />
                </div>
              )
            )}
          </>
        ) : (<>
          {activeLayerItem.map((e,index) => 
            (
              <div className={s.menuSubItem} key={index} onClick={() => e.function()} >
                <p>{e.name}</p>
                <img src={remove_layer_icon} alt="" />
              </div>
            ))}
        </>) }
      </div>
    </>
  )
};

export default memo(SideBar);
