import s from './index.module.scss';
import SearchIcon from '../../../shared/assets/svg/search';
import SatteliteIcon from '../../../shared/assets/svg/sattelite';

import HelpIcon from '../../../shared/assets/svg/help';
import useQueryBaseMap from '../../hooks/useQueryBaseMap';
import { useLayerToggleStore } from '../../../shared/hooks/useLayerToggleStore';
import StreetIcon from '../../../shared/assets/svg/street';

const BasemapSwitch = () => {
  const { switchBaseMap } = useQueryBaseMap();

  return (
    <div className={s.container}>
      <p>Basemap Mode</p>
      <StreetIcon />
      <label className={`${s.formswitch} ml-2`}>
        <input onClick={switchBaseMap} type="checkbox" />
        <i></i>
      </label>
      <SatteliteIcon />
    </div>
  );
};

const SettingBar = () => {
  const { selectedLayer, setSelectedLayer } = useLayerToggleStore();

  return (
    <div className={`${s.settingWrapper} border-b-2`}>
      <HelpIcon />
      <div className={s.pembatas}></div>

      {/* Layer Toggle */}
      <div className={s.layerToggle}>
        <button
          className={`${s.toggleOption} ${selectedLayer === 'none' ? s.active : ''}`}
          onClick={() => setSelectedLayer('none')}
        >
          Default
        </button>
        <button
          className={`${s.toggleOption} ${selectedLayer === 'desa' ? s.active : ''}`}
          onClick={() => setSelectedLayer('desa')}
        >
          Desa
        </button>
        <button
          className={`${s.toggleOption} ${selectedLayer === 'kecamatan' ? s.active : ''}`}
          onClick={() => setSelectedLayer('kecamatan')}
        >
          Kecamatan
        </button>
      </div>

      <div className={s.pembatas}></div>

      <BasemapSwitch />

      <div className={s.pembatas}></div>
    </div>
  );
};

export default SettingBar;
