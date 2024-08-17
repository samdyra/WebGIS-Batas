import axios, { type AxiosPromise, type AxiosRequestConfig } from 'axios';
import useAuthStore from '../../auth/hooks/useAuthStore';

const instance = axios.create({
  timeout: 1000 * 60 * 5,
});

const baseURLEnv = import.meta.env.VITE_BASE_API_URL;

export const fetch = <T>(params: AxiosRequestConfig): AxiosPromise<T> => {
  const baseURL = baseURLEnv;

  instance.defaults.baseURL = baseURL;

  return instance(params);
};

type ContentType = 'application/json' | 'multipart/form-data';

export default function useFetch<TResponse = unknown, TArgs = unknown>(
  fn: (args?: TArgs) => AxiosRequestConfig,
  contentType: ContentType = 'application/json'
) {
  const { token } = useAuthStore();

  return async (args?: TArgs) => {
    const config = fn(args);

    let headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };

    if (contentType === 'application/json') {
      headers['Content-Type'] = 'application/json';
    }
    // For multipart/form-data, don't set Content-Type header
    // axios will set it automatically with the correct boundary

    return fetch<TResponse>({
      ...config,
      headers: {
        ...config.headers,
        ...headers,
      },
    }).then((res) => res.data);
  };
}
