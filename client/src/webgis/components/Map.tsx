import { useRef, useCallback, useEffect, useMemo } from 'react';
import Map, { MapRef, Source, Layer, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useQueryLayers } from '../../admin/Layer/hooks';

import 'maplibre-gl/dist/maplibre-gl.css';
import useQueryBaseMap from '../hooks/useQueryBaseMap';

import useIDStore from '../hooks/useIDStore';
import useZoomToCoordinate from '../hooks/useZoomToCoordinate';
import useFeatureData from '../hooks/useGetFeature';

function convertLayerIdToName(layerId: string): string {
  // Remove the "source-" prefix
  const withoutPrefix = layerId.replace(/^source-/, '');

  // Replace underscores with spaces
  const withSpaces = withoutPrefix.replace(/_/g, ' ');

  return withSpaces;
}

const MapComponent = () => {
  const { baseMap } = useQueryBaseMap();
  const mapRef = useRef<MapRef>(null);
  const { ids } = useIDStore();
  const { data: mvtLayers } = useQueryLayers(ids);
  const { coordinate } = useZoomToCoordinate();
  const { setFeatureData } = useFeatureData();

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

  const handleLayerClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const clickedFeatures = event.features;
      if (clickedFeatures && clickedFeatures.length > 0) {
        const clickedFeature = clickedFeatures[0];
        console.log(clickedFeature);

        setFeatureData(convertLayerIdToName(clickedFeature.layer.source), clickedFeature.properties);
      }
    },
    [setFeatureData]
  );

  const memoizedLayers = useMemo(() => {
    return mvtLayers?.map((mvtLayer) => (
      <Source
        key={mvtLayer?.layer?.id}
        id={`source-${mvtLayer?.layer?.id}`}
        type="geojson"
        data={mvtLayer?.layer?.source?.tiles}
      >
        <Layer
          id={`layer-${mvtLayer?.layer?.id}`}
          type={mvtLayer?.layer?.type as 'line'}
          paint={mvtLayer?.layer?.paint}
        />
      </Source>
    ));
  }, [mvtLayers]);

  useEffect(() => {
    handleZoomToCoordinate();
  }, [coordinate, handleZoomToCoordinate]);

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
      onClick={handleLayerClick}
      interactiveLayerIds={mvtLayers?.map((layer) => `layer-${layer?.layer?.id}`)}
    >
      {memoizedLayers}
    </Map>
  );
};

export default MapComponent;
