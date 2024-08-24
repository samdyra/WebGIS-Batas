import { useQuery } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';

export type LayerGroups = {
  group_id: number;
  group_name: string;
  layers: {
    layer_id: number;
    layer_name: string;
    coordinate: [number, number];
    color: string;
  }[];
};

export const K_LAYER_GROUP_QUERY_KEY = 'layer-group';

const useQueryLayerGroup = () => {
  const fetch = useFetch<LayerGroups[]>(() => ({
    method: 'GET',
    url: '/layer-groups',
  }));

  return useQuery([K_LAYER_GROUP_QUERY_KEY], fetch);
};

export default useQueryLayerGroup;
