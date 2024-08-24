import { useRef, useCallback } from 'react';
import Map, { MapRef, Source, Layer } from 'react-map-gl/maplibre';
import { useQueryLayers } from '../../../admin/Layer/hooks';

import 'maplibre-gl/dist/maplibre-gl.css';
import useQueryBaseMap from '../../hooks/useQueryBaseMap';

import useIDStore from '../../hooks/useIDStore';

interface Coordinate {
  lng: number;
  lat: number;
}

const MapComponent = () => {
  const { baseMap } = useQueryBaseMap();
  const mapRef = useRef<MapRef>(null);

  const { ids } = useIDStore();

  const { data: mvtLayers } = useQueryLayers(ids);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 106.9806050240001,
        latitude: -6.256614237999927,
        zoom: 12,
      }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={baseMap}
    >
      {mvtLayers?.map((mvtLayer) => (
        <Source id={mvtLayer?.layer?.id} type="vector" tiles={[mvtLayer?.layer?.source?.tiles]}>
          <Layer
            id={mvtLayer?.layer?.id}
            type={mvtLayer?.layer?.type as 'line'}
            source-layer={mvtLayer?.layer?.['source-layer']}
            paint={mvtLayer?.layer?.paint}
          />
        </Source>
      ))}
    </Map>
  );
};

export default MapComponent;

export const useZoomToCoordinate = () => {
  const mapRef = useRef<MapRef>(null);
  const zoomToCoordinate = useCallback((coordinate: Coordinate, zoom: number = 14) => {
    console.log('hits', coordinate);
    mapRef.current?.flyTo({
      center: [coordinate.lng, coordinate.lat],
      zoom: zoom,
      duration: 2000,
    });
  }, []);

  return { mapRef, zoomToCoordinate };
};
