import { useRef, useCallback, useEffect } from 'react';
import Map, { MapRef, Source, Layer } from 'react-map-gl/maplibre';
import { useQueryLayers } from '../../../admin/Layer/hooks';

import 'maplibre-gl/dist/maplibre-gl.css';
import useQueryBaseMap from '../../hooks/useQueryBaseMap';

import useIDStore from '../../hooks/useIDStore';
import useZoomToCoordinate from '../../hooks/useZoomToCoordinate';

const MapComponent = () => {
  const { baseMap } = useQueryBaseMap();
  const mapRef = useRef<MapRef>(null);
  const { ids } = useIDStore();
  const { data: mvtLayers } = useQueryLayers(ids);
  const { coordinate } = useZoomToCoordinate();

  const handleZoomToCoordinate = useCallback(() => {
    if (coordinate.length) {
      mapRef.current?.flyTo({
        center: {
          lat: coordinate[0],
          lng: coordinate[1],
        },
        zoom: 12,
      });
    }
  }, [coordinate]);

  useEffect(() => {
    handleZoomToCoordinate();
  }, [coordinate]);

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
        <Source id={mvtLayer?.layer?.id} type="geojson" data={mvtLayer?.layer?.source?.tiles}>
          <Layer id={mvtLayer?.layer?.id} type={mvtLayer?.layer?.type as 'line'} paint={mvtLayer?.layer?.paint} />
        </Source>
      ))}
    </Map>
  );
};

export default MapComponent;
