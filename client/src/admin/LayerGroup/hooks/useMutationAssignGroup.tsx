import { useMutation } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';
import { K_LAYER_GROUP_QUERY_KEY } from './useQueryLayerGroup';
import { useQueryClient } from 'react-query';

type Response = {
  message: string;
};

type Param = {
  layer_id: number;
  group_id: number;
};

export default function useMutationAssignGroup() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Response, Param>((data) => ({
    url: '/layer-groups/add-layer',
    method: 'POST',
    data,
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_GROUP_QUERY_KEY);
    },
  });
}
