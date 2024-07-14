import { useRef, useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useQueryBaseMap from '../../hooks/useQueryBaseMap';

const API_URL = 'http://localhost:3001';

const Map = () => {
  const { baseMap } = useQueryBaseMap();
  const mapContainer = useRef(null);
  const [viewState] = useState({
    longitude: 107.6098,
    latitude: -6.9175,
    zoom: 10,
  });

  useEffect(() => {
    const { longitude, latitude, zoom } = viewState;
    const map = new maplibregl.Map({
      container: mapContainer?.current ?? '',
      style: baseMap,
      center: [longitude, latitude],
      zoom: zoom,
    });

    map.on('load', () => {
      map.addLayer({
        id: 'shp_batas_wgs',
        source: {
          type: 'vector',
          tiles: [`${API_URL}/v1/mvt/shp_batas_wgs/{z}/{x}/{y}`],
        },
        'source-layer': 'shp_batas_wgs',
        type: 'line',
        minzoom: 5,
        paint: {
          'line-color': '#ed6498',
          'line-width': 5,
          'line-opacity': 0.8,
        },
      });

      map.addLayer({
        id: 'batas_titik',
        source: {
          type: 'vector',
          tiles: [`${API_URL}/v1/mvt/batas_titik/{z}/{x}/{y}`],
        },
        'source-layer': 'batas_titik',
        type: 'circle',
        minzoom: 5,
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf',
        },
      });
    });

    return () => map.remove();
  }, [viewState, baseMap]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
