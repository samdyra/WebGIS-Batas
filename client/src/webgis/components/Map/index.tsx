import { useRef, useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useQueryBaseMap from '../../hooks/useQueryBaseMap';
import useQueryMVT from '../../hooks/useQueryMVT';

const Map = () => {
  const { baseMap } = useQueryBaseMap();
  const { data: layers = [] } = useQueryMVT();

  const mapContainer = useRef(null);
  const [viewState] = useState({
    longitude: 107.6098,
    latitude: -6.9175,
    zoom: 10,
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    const { longitude, latitude, zoom } = viewState;
    const map = new maplibregl.Map({
      container: mapContainer?.current ?? '',
      style: baseMap,
      center: [longitude, latitude],
      zoom: zoom,
    });

    map.on('load', () => {
      layers.forEach((layer) => {
        map.addLayer({ ...layer });
      });
    });

    return () => map.remove();
  }, [viewState, baseMap, layers]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
