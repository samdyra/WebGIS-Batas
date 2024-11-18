import axios, { type AxiosPromise, type AxiosRequestConfig } from 'axios';
import useAuthStore from '../../auth/hooks/useAuthStore';

// Create an Axios instance
const instance = axios.create({
  baseURL: 'http://103.6.53.254:20250',
  timeout: 1000 * 60 * 5,
});

// Add interceptors to handle 401 errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      alert('Session ended');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Fetch function using the Axios instance
export const fetch = <T>(params: AxiosRequestConfig): AxiosPromise<T> => {
  return instance(params);
};

type ContentType = 'application/json' | 'multipart/form-data';

export default function useFetch<TResponse = unknown, TArgs = unknown>(
  fn: (args?: TArgs) => AxiosRequestConfig,
  contentType: ContentType = 'application/json'
) {
  const { token } = useAuthStore.getState();

  return async (args?: TArgs) => {
    const config = fn(args);

    let headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (contentType === 'application/json') {
      headers['Content-Type'] = 'application/json';
    }

    return fetch<TResponse>({
      ...config,
      headers: {
        ...config.headers,
        ...headers,
      },
    }).then((res) => res.data);
  };
}
