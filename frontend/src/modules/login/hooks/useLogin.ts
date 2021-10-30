import { useContext } from 'react';
import { useMutation } from 'react-query';
import { LoginUserDTO } from 'generated-api';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  useGlobalStore,
} from '../../../shared/stores';
import { useRouter } from 'next/router';

export const useLogin = () => {
  const api = useContext(ApiContext);
  const setUser = useGlobalStore((state) => state.setUser);
  const router = useRouter();

  return useMutation((loginDTO: LoginUserDTO) => api.logIn(loginDTO), {
    onSuccess: ({ data }) => {
      const { user, accessToken, refreshToken } = data;

      setUser(user);
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);

      router.push('/');
    },
  });
};
