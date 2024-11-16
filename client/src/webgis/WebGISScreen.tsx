// src/screens/WebGISScreen.js
import Sidebar from './components/Sidebar';
import MapComponent from './components/Map';
import SettingBar from './components/Settingbar';
import Detailbar from './components/Detailbar';
import LayerIcon from '../shared/assets/svg/layer';
import AlertIcon from '../shared/assets/svg/alert';
import UploadIcon from '../shared/assets/svg/upload';
import ReportIssue from './components/ReportIssue';
import CheckAreaBoundary from './components/CheckArea';
import LayerManagement from './components/LayerManagement';
import LayerDetail from './components/LayerDetail';
import useDetailBarStore from './hooks/useDetailBarStore';
import { useState } from 'react';

const menuItems = [
  { icon: LayerIcon, label: 'Manajemen Layer' },
  { icon: AlertIcon, label: 'Lapor Batas' },
  { icon: UploadIcon, label: 'Cek Batas' },
];

function WebGISScreen() {
  const [menuIndex, setMenuIndex] = useState(0);
  const { isDetailBarOpen, toggleDetailBar } = useDetailBarStore();

  return (
    <>
      <Detailbar
        handleShowLayerbar={toggleDetailBar}
        isOpen={isDetailBarOpen}
        position="right"
        size="large"
        className="mt-lg"
      >
        <LayerDetail />
      </Detailbar>
      <SettingBar />
      <Sidebar menuItems={menuItems} menuIndex={menuIndex} setMenuIndex={setMenuIndex}>
        {menuIndex === 0 && <LayerManagement />}
        {menuIndex === 1 && <ReportIssue />}
        {menuIndex === 2 && <CheckAreaBoundary />}
      </Sidebar>
      <MapComponent />
    </>
  );
}

export default WebGISScreen;
