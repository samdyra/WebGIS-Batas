import { useMutation, useQueryClient, useQueries } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';

// Key for layer-related queries
const K_LAYER_QUERY_KEY = 'layers';

// Hook for fetching layers
export function useQueryLayers(ids?: string | number[]) {
  const fetchLayers = useFetch<Layer[], { id: string | number }>((args) => ({
    method: 'GET',
    url: '/layers',
    params: { id: args?.id },
  }));

  const normalizedIds = Array.isArray(ids) ? ids : ids ? [ids] : ['*'];

  const queries = normalizedIds.map((id) => ({
    queryKey: [K_LAYER_QUERY_KEY, id],
    queryFn: () => fetchLayers({ id }),
    staleTime: Infinity, // Prevent automatic refetching
  }));

  const results = useQueries(queries);

  // Combine the results into a single array
  const combinedData = results.reduce<Layer[]>((acc, result) => {
    if (result.data) {
      acc.push(...result.data);
    }
    return acc;
  }, []);

  // Calculate loading and error states
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const error = results.find((result) => result.error)?.error;

  return {
    data: combinedData,
    isLoading,
    isError,
    error,
  };
}
// Hook for creating a new layer
export function useMutationCreateLayer() {
  const queryClient = useQueryClient();
  const fetch = useFetch<LayerResponse, CreateLayerParams>((data) => ({
    url: '/layers',
    method: 'POST',
    data,
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_QUERY_KEY);
    },
  });
}

// Hook for updating an existing layer
export function useMutationUpdateLayer() {
  const queryClient = useQueryClient();
  const fetch = useFetch<LayerResponse, UpdateLayerParams>((data) => ({
    url: `/layers/${data?.id}`,
    method: 'PUT',
    data: {
      layer_name: data?.layer_name,
      coordinate: data?.coordinate,
      color: data?.color,
    },
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_QUERY_KEY);
    },
  });
}

// Hook for deleting a layer
export function useMutationDeleteLayer() {
  const queryClient = useQueryClient();
  const fetch = useFetch<DeleteLayerResponse, DeleteLayerParams>((params) => ({
    url: `/layers/${params?.id}`,
    method: 'DELETE',
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_LAYER_QUERY_KEY);
    },
  });
}

// Types
export type Layer = {
  id: number;
  layer_name: string;
  coordinate: [number, number];
  layer: {
    id: string;
    source: {
      type: string;
      tiles: string;
    };
    'source-layer': string;
    type: string;
    paint: Record<string, unknown>;
  };
};

type LayerResponse = {
  id: number;
  spatial_data_id: number;
  layer_name: string;
  coordinate: [number, number];
  color: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
};

export type CreateLayerParams = {
  id: number[] | '*';
  spatial_data_id: number;
  layer_name: string;
  color: string;
};

export type UpdateLayerParams = {
  id: number;
  layer_name?: string;
  coordinate?: [number, number];
  color?: string;
};

type DeleteLayerParams = {
  id: number;
};

type DeleteLayerResponse = {
  message: string;
};
