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
  const withoutPrefix = layerId.replace(/^source-/, '');
  const withSpaces = withoutPrefix.replace(/_/g, ' ');
  return withSpaces;
}

const MapComponent = () => {
  const { baseMap } = useQueryBaseMap();
  const mapRef = useRef<MapRef>(null);
  const { ids } = useIDStore();
  const { data: layersData } = useQueryLayers(ids);
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
        setFeatureData(convertLayerIdToName(clickedFeature.layer.source), clickedFeature.properties);
      }
    },
    [setFeatureData]
  );

  const prevFilesLengthRef = useRef(files ? files.length : 0);

  useEffect(() => {
    if (files && files.length > prevFilesLengthRef.current) {
      // New file(s) added
      const lastFile = files[files.length - 1];
      if (lastFile.bbox && mapRef.current) {
        const [minX, minY, maxX, maxY] = lastFile.bbox;
        mapRef.current.fitBounds(
          [
            [minX, minY],
            [maxX, maxY],
          ],
          { padding: 20 }
        );
      }
    }
    prevFilesLengthRef.current = files ? files.length : 0;
  }, [files]);

  const memoizedLayers = useMemo(() => {
    const layers =
      layersData?.map((mvtLayer) => {
        if (mvtLayer.layer.type === 'circle') {
          const color = mvtLayer?.layer?.paint?.['circle-color'] || 'yellow';

          // Create the marker SVG with hole at the top and black outline
          const markerSvg = `
            <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 0C5.383 0 0 5.383 0 12c0 9.185 12 24 12 24s12-14.815 12-24c0-6.617-5.383-12-12-12z" 
                fill="${color}"
                stroke="black"
                stroke-width="1"
              />
              <circle 
                cx="12" 
                cy="12" 
                r="5" 
                fill="white"
                stroke="black"
                stroke-width="1"
              />
            </svg>
          `;

          const markerId = `marker-${mvtLayer?.layer?.id}`;

          // Add the colored marker to the map
          if (mapRef.current?.getMap()) {
            const markerImage = new Image();
            markerImage.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markerSvg);

            markerImage.onload = () => {
              const map = mapRef.current?.getMap();
              if (map) {
                map.addImage(markerId, markerImage, { sdf: false });
              }
            };
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
                type="symbol"
                layout={{
                  'icon-image': markerId,
                  'icon-size': 1,
                  'icon-allow-overlap': true,
                  'icon-ignore-placement': true,
                  'icon-anchor': 'bottom',
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
                'fill-color': 'rgba(255, 0, 0, 0.5)',
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
  }, [layersData, files]);

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
          ...(layersData?.map((layer) => `layer-${layer?.layer?.id}`) || []),
          ...(files?.map((file) => `layer-${file.name}`) || []),
        ]}
      >
        {memoizedLayers}
      </Map>
    </div>
  );
};

export default MapComponent;
