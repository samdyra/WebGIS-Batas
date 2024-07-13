import Sidebar from './components/Sidebar';
import { useState } from 'react';
import MapComponent from './components/Map';
import SettingBar from './components/Settingbar';
import Detailbar from './components/Detailbar';
import LayerIcon from '../shared/assets/svg/layer';
import AlertIcon from '../shared/assets/svg/alert';
import UploadIcon from '../shared/assets/svg/upload';

const menuItems = [
  { icon: LayerIcon, label: 'Manajemen Layer' },
  { icon: AlertIcon, label: 'Lapor Batas' },
  { icon: UploadIcon, label: 'Cek Batas' },
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
