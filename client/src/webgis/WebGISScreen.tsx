import Sidebar from './components/Sidebar';
import { useState } from 'react';
import MapComponent from './components/Map';
import SettingBar from './components/Settingbar';
import Detailbar from './components/Detailbar';
import LayerIcon from '../shared/assets/svg/layer';
import AlertIcon from '../shared/assets/svg/alert';
import UploadIcon from '../shared/assets/svg/upload';
import useQueryLayers from './hooks/useQueryLayers';
import { TLayer } from './hooks/useQueryLayers';

const menuItems = [
  { icon: LayerIcon, label: 'Manajemen Layer' },
  { icon: AlertIcon, label: 'Lapor Batas' },
  { icon: UploadIcon, label: 'Cek Batas' },
];

function WebGISScreen() {
  const [menuIndex, setMenuIndex] = useState(0);
  const [isDetailBarOpen, setIsDetailBarOpen] = useState(false);
  const { data: layers = [], setVisibility } = useQueryLayers();
  const handleOpenDetailBar = () => setIsDetailBarOpen(!isDetailBarOpen);

  const handleSetVisibility = (layer: TLayer) => {
    if (!layer?.visibility) {
      setVisibility(layer.table_name, 'none');

      return;
    }

    setVisibility(layer.table_name, layer.visibility === 'visible' ? 'none' : 'visible');
  };

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
      <Sidebar menuItems={menuItems} menuIndex={menuIndex} setMenuIndex={setMenuIndex}>
        {layers.map((layer, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={!layer.visibility || layer.visibility === 'visible'}
              onChange={() => handleSetVisibility(layer)}
            />
            <button className="border-2 border-red-500">{layer.table_name}</button>
          </div>
        ))}
      </Sidebar>
      <MapComponent />
    </>
  );
}

export default WebGISScreen;
