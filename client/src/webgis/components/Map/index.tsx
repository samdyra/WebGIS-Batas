import { useRef, useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useQueryBaseMap from '../../hooks/useQueryBaseMap';
import useQueryMVT from '../../hooks/useQueryMVT';
import useFeatureData from '../../hooks/useGetFeature';
import useUploadFiles from '../../hooks/useUploadFiles';

const Map = () => {
  const { baseMap } = useQueryBaseMap();
  const { data: layers = [] } = useQueryMVT();
  const { setFeatureData } = useFeatureData();
  const { files } = useUploadFiles();

  const mapContainer = useRef(null);
  const [viewState] = useState({
    longitude: 106.9806050240001,
    latitude: -6.256614237999927,
    zoom: 12,
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

      // Add GeoJSON data as layers
      files?.forEach((file, index) => {
        map.addSource(`geojson-${index}`, {
          type: 'geojson',
          // @ts-ignore
          data: file?.content,
        });

        map.addLayer({
          id: `geojson-layer-${index}`,
          type: 'fill',
          source: `geojson-${index}`,

          paint: {
            'fill-color': 'green',
            'fill-opacity': 0.8,
          },
        });
      });
    });

    // Add click event listener
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (features.length) {
        setFeatureData(features[0].properties);
        console.log(features[0]);
      }
    });

    return () => map.remove();
  }, [viewState, baseMap, layers, files]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
