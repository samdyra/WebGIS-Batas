import s from './index.module.scss';

import help from '../../../../public/helpSymbol.png';
import light from '../../../../public/light.png';
import night from '../../../../public/night.png';
import search from '../../../../public/search.png';

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
  return (
    <div className={s.container}>
      <p>Basemap Mode</p>
      <img src={light} style={{ height: '20px', width: '20px', marginRight: '7px' }}></img>
      <label className={s.formswitch}>
        <input
          // onClick={onClick}
          type="checkbox"
        />
        <i></i>
      </label>
      <img src={night} style={{ height: '20px', width: '20px' }}></img>
    </div>
  );
};

const Searchbar = () => {
  return (
    <div className={s.searchcontainer}>
      <div className={s.topnav}>
        <input type="text" placeholder="Search.." />
      </div>
      <img src={search} style={{ height: '18px', width: '18px' }}></img>
    </div>
  );
};

const SettingBar = () => {
  return (
    <div className={`${s.settingWrapper} border-b-2 `}>
      <img src={help} className={s.help}></img>
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
