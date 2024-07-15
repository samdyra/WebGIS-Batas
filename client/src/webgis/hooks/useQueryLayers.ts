import { useQuery } from 'react-query';
import useFetch from '../../shared/hooks/useFetch';
import { K_MAP_LAYERS_QUERY_KEY } from '../../shared/constants/queryKeys';
import { geom_type } from '../type';

type TResponse = {
  table_name: string;
  table_type: string;
  geometry_column: string;
  coord_dimension: number;
  srid: number;
  type: geom_type;
};

const useQueryLayers = () => {
  const fetch = useFetch<TResponse[]>(() => ({
    method: 'GET',
    url: '/v1/list_tables',
    params: {
      filter: 'type is not null',
    },
  }));

  return useQuery([K_MAP_LAYERS_QUERY_KEY], fetch);
};

export default useQueryLayers;
