import { useMutation } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';
import { K_LAYER_GROUP_QUERY_KEY } from './useQueryLayerGroup';
import { useQueryClient } from 'react-query';

type Response = {
  message: string;
};

type DeleteGroupParam = {
  id: number;
};

export default function useMutationDeleteGroup() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Response, DeleteGroupParam>((param) => ({
    url: `/layer-groups/${param?.id}`,
    method: 'DELETE',
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_GROUP_QUERY_KEY);
    },
  });
}
