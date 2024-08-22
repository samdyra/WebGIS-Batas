import { useMutation } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';
import { K_LAYER_GROUP_QUERY_KEY } from './useQueryLayerGroup';
import { useQueryClient } from 'react-query';

type Response = {
  message: string;
};

export type UnnasignGroupParam = {
  layer_id: number;
  group_id: number;
};

export default function useMutationUnnasignGroup() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Response, UnnasignGroupParam>((param) => {
    return {
      url: '/layer-groups/remove-layer',
      method: 'DELETE',
      params: param,
    };
  });

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_GROUP_QUERY_KEY);
    },
  });
}
