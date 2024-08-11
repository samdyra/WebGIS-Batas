import axios, { type AxiosError, type AxiosPromise, type AxiosRequestConfig } from 'axios';

export type GeneralResponse<TResponse = unknown> = TResponse;

export type GeneralErrorResponse = AxiosError<{
  statusCode: number;
  code: string;
  error: string;
  message: string;
}>;

const instance = axios.create({
  timeout: 1000 * 60 * 5, // 5 minutes
});

export const fetch = <T>(params: AxiosRequestConfig): AxiosPromise<T> => {
  const baseURL = 'http://localhost:8080';

  instance.defaults.baseURL = baseURL;

  return instance(params);
};

export default function useFetch<TResponse = unknown, TArgs = unknown>(fn: (args?: TArgs) => AxiosRequestConfig) {
  return async (args?: TArgs) => {
    const config = fn(args);

    return fetch<TResponse>({
      ...config,
    }).then((res) => res.data);
  };
}
