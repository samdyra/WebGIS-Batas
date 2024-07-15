import useQueryLayers from './useQueryLayers';
import { useCallback } from 'react';
import { API_ENDPOINT } from '../../shared/constants/secret';
import { useQuery } from 'react-query';
import { K_MAP_MVT_QUERY_KEY } from '../../shared/constants/queryKeys';
import { geom_type } from '../type';
import { AddLayerObject } from 'maplibre-gl';

const getLayerType = (geomType: geom_type) => {
  switch (geomType) {
    case 'MULTIPOINT':
      return 'circle';
    case 'MULTILINESTRING':
      return 'line';
    case 'MULTIPOLYGON':
      return 'fill';
    default:
      return 'line';
  }
};

const getPaint = (geomType: geom_type) => {
  switch (geomType) {
    case 'MULTIPOINT':
      return {
        'circle-radius': 10,
        'circle-color': '#007cbf',
      };
    case 'MULTILINESTRING':
      return {
        'line-color': '#ed6498',
        'line-width': 5,
        'line-opacity': 0.8,
      };
    case 'MULTIPOLYGON':
      return {
        'fill-color': '#ed6498',
        'fill-opacity': 0.8,
      };
    default:
      return {
        'line-color': '#ed6498',
        'line-width': 5,
        'line-opacity': 0.8,
      };
  }
};

const useQueryMVT = () => {
  const { data: layers = [] } = useQueryLayers();

  const getMVTLayers = useCallback(() => {
    return layers?.map((item) => {
      const layer: AddLayerObject = {
        id: item.table_name,
        source: {
          type: 'vector',
          tiles: [`${API_ENDPOINT}/v1/mvt/${item.table_name}/{z}/{x}/{y}`],
        },
        'source-layer': item.table_name,
        type: getLayerType(item.type),
        paint: getPaint(item.type),
      };

      return layer;
    });
  }, [layers]);

  const query = useQuery([K_MAP_MVT_QUERY_KEY, layers], getMVTLayers);

  return query;
};

export default useQueryMVT;
