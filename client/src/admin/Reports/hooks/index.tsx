import { useQuery, useMutation, useQueryClient } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';

// Key for report-related queries
const K_REPORT_QUERY_KEY = 'reports';

// Hook for fetching all reports
export function useQueryReports() {
  const fetch = useFetch<Report[]>(() => ({
    method: 'GET',
    url: '/reports',
  }));

  return useQuery(K_REPORT_QUERY_KEY, fetch);
}

// Hook for fetching a specific report
export function useQueryReport(id: number) {
  const fetch = useFetch<Report>(() => ({
    method: 'GET',
    url: `/reports/${id}`,
  }));

  return useQuery([K_REPORT_QUERY_KEY, id], fetch);
}

// Hook for creating a new report
export function useMutationCreateReport() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Report, CreateReportParams>((data) => ({
    url: '/reports',
    method: 'POST',
    data,
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_REPORT_QUERY_KEY);
    },
  });
}

export function useMutationUpdateReport() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Report, UpdateReportParams>((data) => ({
    url: `/reports/${data?.id}`,
    method: 'PUT',
    data: {
      reporter_name: data?.reporter_name,
      email: data?.email,
      description: data?.description,
      data_file: data?.data_file,
      file_extension: data?.file_extension,
    },
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_REPORT_QUERY_KEY);
    },
  });
}

// Hook for deleting a report
export function useMutationDeleteReport() {
  const queryClient = useQueryClient();
  const fetch = useFetch<DeleteReportResponse, DeleteReportParams>((params) => ({
    url: `/reports/${params?.id}`,
    method: 'DELETE',
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_REPORT_QUERY_KEY);
    },
  });
}

// Types
export type Report = {
  id: number;
  reporter_name: string;
  email: string;
  description: string;
  data_url: string | null;
  created_at: string;
};

export type CreateReportParams = {
  reporter_name: string;
  email: string;
  description: string;
  data_file?: string;
  file_extension?: string;
};

export type UpdateReportParams = {
  id: number;
  reporter_name?: string;
  email?: string;
  description?: string;
  data_file?: string;
  file_extension?: string;
};

type DeleteReportParams = {
  id: number;
};

type DeleteReportResponse = {
  message: string;
};
