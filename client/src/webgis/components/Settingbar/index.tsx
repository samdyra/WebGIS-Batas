import s from './index.module.scss';
import SatteliteIcon from '../../../shared/assets/svg/sattelite';
import HelpIcon from '../../../shared/assets/svg/help';
import SearchIcon from '../../../shared/assets/svg/search';
import useQueryBaseMap from '../../hooks/useQueryBaseMap';
import StreetIcon from '../../../shared/assets/svg/street';

const Dropdown = () => {
  return (
    <div className={s.dropdown}>
      <button className={s.dropbtn}>
        Download Data
        <i className="fa fa-caret-down"></i>
      </button>
      <div className={s.dropdowncontent}>
        <a href="#">Polygon</a>
        <a href="#">Contour Lines</a>
        <a href="#">Map Layout</a>
      </div>
    </div>
  );
};

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

const Searchbar = () => {
  return (
    <div className={s.searchcontainer}>
      <div className={s.topnav}>
        <input type="text" placeholder="Search.." />
      </div>
      <SearchIcon />
    </div>
  );
};

const SettingBar = () => {
  return (
    <div className={`${s.settingWrapper} border-b-2 `}>
      {/* <img src={help} className={s.help}></img> */}
      <HelpIcon />
      <div className={s.pembatas}></div>
      <Searchbar></Searchbar>
      <div className={s.pembatas}></div>
      <BasemapSwitch></BasemapSwitch>
      <div className={s.pembatas}></div>
      <Dropdown></Dropdown>
      <div className={s.pembatas}></div>
    </div>
  );
};

export default SettingBar;
