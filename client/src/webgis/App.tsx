import Sidebar from './components/Sidebar';
import { useState } from 'react';
import MapComponent from './components/Map';
import SettingBar from './components/Settingbar';
import Detailbar from './components/Detailbar';

import layer from '/layer.svg';

const menuItems = [
  { icon: layer, label: 'Bathymetry' },
  { icon: layer, label: 'Water Level' },
  { icon: layer, label: 'Surface Currents' },
];

function WebGIS() {
  const [menuIndex, setMenuIndex] = useState(0);
  const [isDetailBarOpen, setIsDetailBarOpen] = useState(false);
  const handleOpenDetailBar = () => setIsDetailBarOpen(!isDetailBarOpen);

  return (
    <>
      <Detailbar
        handleShowLayerbar={handleOpenDetailBar}
        isOpen={isDetailBarOpen}
        position="right"
        size="large"
        className="mt-lg"
      />
      <SettingBar />
      <Sidebar menuItems={menuItems} menuIndex={menuIndex} setMenuIndex={setMenuIndex} />
      <MapComponent />
    </>
  );
}

export default WebGIS;
