import { useRef, useCallback, useEffect, useMemo } from 'react';
import Map, { MapRef, Source, Layer, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useQueryLayers } from '../../admin/Layer/hooks';

import 'maplibre-gl/dist/maplibre-gl.css';
import useQueryBaseMap from '../hooks/useQueryBaseMap';

import useIDStore from '../hooks/useIDStore';
import useZoomToCoordinate from '../hooks/useZoomToCoordinate';
import useFeatureData from '../hooks/useGetFeature';
import useGeospatialUpload from '../hooks/useGeospatialUpload';

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
  const { files } = useGeospatialUpload();

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
    const layers =
      mvtLayers?.map((mvtLayer) => {
        if (mvtLayer.layer.type === 'circle') {
          console.log(mvtLayer?.layer?.paint);

          return (
            <Source
              key={`mvt-${mvtLayer?.layer?.id}`}
              id={`source-${mvtLayer?.layer?.id}`}
              type="geojson"
              data={mvtLayer?.layer?.source?.tiles}
            >
              <Layer
                id={`layer-${mvtLayer?.layer?.id}`}
                type={mvtLayer?.layer?.type as 'line'}
                paint={{
                  'circle-color': 'blue',
                  'circle-radius': 7,
                  'circle-stroke-width': 1,
                  'circle-opacity': 1,
                }}
              />
            </Source>
          );
        }

        return (
          <Source
            key={`mvt-${mvtLayer?.layer?.id}`}
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
        );
      }) || [];

    const uploadedLayers =
      files?.map((file) => (
        <Source key={`uploaded-${file.name}`} id={`source-${file.name}`} type="geojson" data={file.content}>
          {file.type === 'POLYGON' && (
            <Layer
              id={`layer-${file.name}`}
              type="fill"
              paint={{
                'fill-color': 'rgba(0, 255, 0, 0.5)',
                'fill-outline-color': 'green',
              }}
            />
          )}
          {file.type === 'LINESTRING' && (
            <Layer
              id={`layer-${file.name}`}
              type="line"
              paint={{
                'line-color': 'blue',
                'line-width': 2,
              }}
            />
          )}
          {file.type === 'POINT' && (
            <Layer
              id={`layer-${file.name}`}
              type="circle"
              paint={{
                'circle-color': 'red',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': 'white',
              }}
            />
          )}
        </Source>
      )) || [];

    return [...layers, ...uploadedLayers];
  }, [mvtLayers, files]);

  useEffect(() => {
    handleZoomToCoordinate();
  }, [coordinate, handleZoomToCoordinate]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 106.9806050240001,
          latitude: -6.256614237999927,
          zoom: 12,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={baseMap}
        onClick={handleLayerClick}
        interactiveLayerIds={[
          ...(mvtLayers?.map((layer) => `layer-${layer?.layer?.id}`) || []),
          ...(files?.map((file) => `layer-${file.name}`) || []),
        ]}
      >
        {memoizedLayers}
      </Map>
    </div>
  );
};

export default MapComponent;
