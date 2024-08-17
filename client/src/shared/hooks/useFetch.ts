import axios, { type AxiosError, type AxiosPromise, type AxiosRequestConfig } from 'axios';
import useAuthStore from '../../auth/hooks/useAuthStore';

type GeneralResponse<TResponse = unknown> = TResponse;

export type GeneralErrorResponse = AxiosError<{
  status_code: number;
  code: string;
  error: string;
  message: string;
}>;

export type GeneralSuccessResponse<TResponse = unknown> = GeneralResponse<{
  data: TResponse;
  message: string;
  status_code: number;
  success: boolean;
}>;

export type GeneralSuccessMutationResponse<TResponse = unknown> = GeneralResponse<{
  data: TResponse;
  message: string;
  status_code: number;
  success: boolean;
}>;

const instance = axios.create({
  timeout: 1000 * 60 * 5,
});

const baseURLEnv = import.meta.env.VITE_BASE_API_URL;

export const fetch = <T>(params: AxiosRequestConfig): AxiosPromise<T> => {
  const baseURL = baseURLEnv;

  instance.defaults.baseURL = baseURL;

  return instance(params);
};

export default function useFetch<TResponse = unknown, TArgs = unknown>(fn: (args?: TArgs) => AxiosRequestConfig) {
  const { token } = useAuthStore();

  return async (args?: TArgs) => {
    const config = fn(args);

    return fetch<TResponse>({
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.data);
  };
}
