import { useQuery } from 'react-query';
import useFetch from '../../shared/hooks/useFetch';
import { K_MAP_LAYERS_QUERY_KEY } from '../../shared/constants/queryKeys';
import { geom_type } from '../type';
import { useQueryClient } from 'react-query';

export type TLayer = {
  table_name: string;
  table_type: string;
  geometry_column: string;
  coord_dimension: number;
  srid: number;
  type: geom_type;
  visibility: 'visible' | 'none';
};

const useQueryLayers = () => {
  const queryClient = useQueryClient();

  const fetch = useFetch<TLayer[]>(() => ({
    method: 'GET',
    url: '/v1/list_tables',
    params: {
      filter: 'type is not null',
    },
  }));

  const query = useQuery([K_MAP_LAYERS_QUERY_KEY], fetch);

  const setVisibility = (tableName: string, visibility: TLayer['visibility']) => {
    queryClient.setQueryData<TLayer[]>(K_MAP_LAYERS_QUERY_KEY, (prev = []) => {
      const newData = prev?.map((item) => {
        if (item.table_name === tableName) {
          return {
            ...item,
            visibility,
          };
        }
        return item;
      });

      return newData;
    });
  };

  return {
    ...query,
    setVisibility,
  };
};

export default useQueryLayers;
