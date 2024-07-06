import { useRef, useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = () => {
  const mapContainer = useRef(null);
  const [viewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1,
  });

  useEffect(() => {
    const { longitude, latitude, zoom } = viewState;
    const map = new maplibregl.Map({
      container: mapContainer?.current ?? '',
      style: 'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [longitude, latitude],
      zoom: zoom,
    });

    return () => map.remove();
  }, [viewState]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
