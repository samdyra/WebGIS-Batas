import { useMutation } from 'react-query';
import useFetch from '../../shared/hooks/useFetch';
import useAuthStore from './useAuthStore';
import { jwtDecode } from 'jwt-decode';

type Response = {
  token: string;
};

type Param = {
  username: string;
  password: string;
};

export default function useSignIn() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const fetch = useFetch<Response, Param>((data) => ({
    url: '/signin',
    method: 'POST',
    data,
  }));

  return useMutation(fetch, {
    onError: () => {
      alert('Invalid username or password');
    },
    onSuccess: (response) => {
      setAuth(jwtDecode(response.token), response.token);
    },
  });
}
