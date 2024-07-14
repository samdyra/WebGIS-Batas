import axios, { type AxiosError, type AxiosPromise, type AxiosRequestConfig } from 'axios';

export type GeneralResponse<TResponse = unknown> = TResponse;

export type GeneralErrorResponse = AxiosError<{
  statusCode: number;
  code: string;
  error: string;
  message: string;
}>;

export type FetchConfig = AxiosRequestConfig & {
  isGapuraGateway?: boolean;
};

const instance = axios.create({
  timeout: 1000 * 60 * 5, // 5 minutes
});

export const fetch = <T>(params: FetchConfig): AxiosPromise<T> => {
  const baseURL = 'http://localhost:3001';

  instance.defaults.baseURL = baseURL;

  return instance(params);
};

export default function useFetch<TResponse = unknown, TArgs = unknown>(fn: (args?: TArgs) => FetchConfig) {
  return async (args?: TArgs) => {
    const config = fn(args);

    return fetch<TResponse>({
      ...config,
    });
  };
}
