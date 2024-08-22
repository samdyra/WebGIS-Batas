import { useQuery, useMutation, useQueryClient } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';

// Key for spatial data-related queries
const K_SPATIAL_DATA_QUERY_KEY = 'spatial-data';

// Hook for fetching all spatial data
export function useQuerySpatialData() {
  const fetch = useFetch<SpatialData[]>(() => ({
    method: 'GET',
    url: '/spatial-data',
  }));

  return useQuery(K_SPATIAL_DATA_QUERY_KEY, fetch);
}

// Hook for creating new spatial data
export function useMutationCreateSpatialData() {
  const queryClient = useQueryClient();
  const fetch = useFetch<CreateSpatialDataResponse, CreateSpatialDataParams>((data) => {
    const formData = new FormData();
    if (data) {
      formData.append('table_name', data.table_name);
      formData.append('type', data.type);
      formData.append('file', data.file);
    }

    console.log(formData);

    return {
      url: '/spatial-data',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }, 'multipart/form-data');

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_SPATIAL_DATA_QUERY_KEY);
    },
  });
}

// Hook for updating existing spatial data
export function useMutationUpdateSpatialData() {
  const queryClient = useQueryClient();
  const fetch = useFetch<UpdateSpatialDataResponse, UpdateSpatialDataParams>((data) => {
    const formData = new FormData();
    if (data?.new_table_name) {
      formData.append('table_name', data.new_table_name);
    }
    if (data?.file) {
      formData.append('file', data.file);
    }

    return {
      url: `/spatial-data/${data?.current_table_name}`,
      method: 'PUT',
      data: formData,
    };
  }, 'multipart/form-data');

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_SPATIAL_DATA_QUERY_KEY);
    },
  });
}

// Hook for deleting spatial data
export function useMutationDeleteSpatialData() {
  const queryClient = useQueryClient();
  const fetch = useFetch<DeleteSpatialDataResponse, DeleteSpatialDataParams>((params) => ({
    url: `/spatial-data/${params?.table_name}`,
    method: 'DELETE',
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_SPATIAL_DATA_QUERY_KEY);
    },
  });
}

// Types
export type SpatialData = {
  id: number;
  table_name: string;
  type: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
};

export type CreateSpatialDataParams = {
  table_name: string;
  type: string;
  file: File;
};

type CreateSpatialDataResponse = {
  message: string;
};

type UpdateSpatialDataParams = {
  current_table_name: string;
  new_table_name?: string;
  file?: File;
};

type UpdateSpatialDataResponse = {
  message: string;
};

type DeleteSpatialDataParams = {
  table_name: string;
};

type DeleteSpatialDataResponse = {
  message: string;
};
