import React, { useState, useMemo } from "react";
import {
  Sidebar,
  MapScreen,
  BaseMapPicker,
} from "../../Component";
import ReactSearchBox from "react-search-box";
import search_icon from "../../assets/search_icon.png";
import { MAPBOX_API_KEY_STREET } from "../../constants";
import s from "./Home.module.scss";
import { propinsiValues } from "../../constants/Shapefiles/polygon";
import { pointValues } from "../../constants/Shapefiles/marker";

export default function HomeScreen() {
  // ---------- HOOKS ----------
  const [ baseMap, setBaseMap ] = useState({
    url: "mapbox://styles/mapbox/streets-v12",
    sprite: "mapbox://sprites/mapbox/basic-v8",
    apiKey: MAPBOX_API_KEY_STREET,
  });
  const [ isPolygonShown, setIsPolygonShown ] = useState(false);
  const [ isMarkerShown, setIsMarkerShown ] = useState(false);
  const [ zoomCoord, setZoomCoord ] = useState([]);
  const searchIcon = <img src={search_icon} alt="search" />

  const combinedData = useMemo(() => {
    return [ ...propinsiValues, ...pointValues ]
  }, [])

  const activeLayerIndex = [];
  if (isPolygonShown) {
    activeLayerIndex.push(1);
  }
  else if (!isPolygonShown) {
    activeLayerIndex.filter((item) => item !== 1);
  }
  if (isMarkerShown) {
    activeLayerIndex.push(0);
  }
  else if (!isMarkerShown) {
    activeLayerIndex.filter((item) => item !== 0);
  }

  // ---------- INTIAL FUNCTION ----------
  const handlePolygonShown = () => {
    setIsPolygonShown(!isPolygonShown);
  };

  const handleMarkerShown = () => {
    setIsMarkerShown(!isMarkerShown);
  };

  const handleSearchClick = (record) => {
    setZoomCoord(record.item.coordinates)
  };

  // ---------- RENDER FUNCTION ----------
  return (
    <>
      <Sidebar
        pointClick={handleMarkerShown}
        polygonClick={handlePolygonShown}
        activeLayerIndexArray={activeLayerIndex}
      />
      <div className={s.searchbar}>
        <ReactSearchBox
          placeholder="Search on map"
          data={combinedData}
          inputFontColor="#000"
          leftIcon={searchIcon}
          iconBoxSize="50px"
          onSelect={handleSearchClick}
        />
      </div>
      <MapScreen
        baseMap={baseMap}
        isPolygonShown={isPolygonShown}
        isMarkerShown={isMarkerShown}
        zoomCoord={zoomCoord}
      />
      <BaseMapPicker setBaseMap={setBaseMap} />
    </>
  );
}
