import { useQuery } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';

type Response = {
  layer_id: number;
  group_id: number;
};

export const K_LAYER_GROUP_QUERY_KEY = 'layer-group';

const useQueryLayerGroup = () => {
  const fetch = useFetch<Response[]>(() => ({
    method: 'GET',
    url: '/layer-groups',
  }));

  return useQuery([K_LAYER_GROUP_QUERY_KEY], fetch);
};

export default useQueryLayerGroup;
