import { useMutation } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';
import { K_LAYER_GROUP_QUERY_KEY } from './useQueryLayerGroup';
import { useQueryClient } from 'react-query';

type Response = {
  message: string;
};

export default function useMutationDeleteGroup(id: number) {
  const queryClient = useQueryClient();
  const fetch = useFetch<Response>(() => ({
    url: `/layer-groups/${id}`,
    method: 'DELETE',
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_GROUP_QUERY_KEY);
    },
  });
}
