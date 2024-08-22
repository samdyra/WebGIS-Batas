import { useMutation } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';
import { K_LAYER_GROUP_QUERY_KEY } from './useQueryLayerGroup';
import { useQueryClient } from 'react-query';

type Response = {
  message: string;
};

export type CreateGroupParam = {
  group_name: string;
};

export default function useMutationCreateGroup() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Response, CreateGroupParam>((data) => ({
    url: '/layer-groups',
    method: 'POST',
    data,
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_GROUP_QUERY_KEY);
    },
  });
}
