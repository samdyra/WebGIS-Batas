import useFetch from './useFetch';
import { useQuery } from 'react-query';

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

interface GeoJSONFeature {
  type: string;
  properties: {
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

export function usePropData(table_name: string) {
  const fetch = useFetch<GeoJSON>(() => ({
    method: 'GET',
    url: '/geojson/' + table_name,
  }));

  return useQuery(['prop-data', table_name], fetch, {
    enabled: !!table_name,
  });
}
