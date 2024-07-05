import Sidebar from '../common/Sidebar';
import { useState } from 'react';

import logo from '/logo-pemotda.png';
import layer from '/layer.svg';

const menuItems = [
  { name: 'S102', icon: layer, label: 'Bathymetry' },
  { name: 'S104', icon: layer, label: 'Water Level' },
  { name: 'S111', icon: layer, label: 'Surface Currents' },
];

function WebGIS() {
  const [menuIndex, setMenuIndex] = useState(0);

  return (
    <>
      <div>
        <Sidebar menuItems={menuItems} menuIndex={menuIndex} setMenuIndex={setMenuIndex} />
      </div>
    </>
  );
}

export default WebGIS;
