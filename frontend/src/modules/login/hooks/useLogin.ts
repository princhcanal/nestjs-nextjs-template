import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LoginUserDTO } from 'generated-api';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useGlobalStore } from '../../../shared/stores';
import { useRouter } from 'next/router';
import { LocalStorageKeys } from '../../../shared/enums/localStorageKeys';

export const useLogin = () => {
  const api = useContext(ApiContext);
  const setUser = useGlobalStore((state) => state.setUser);
  const router = useRouter();

  return useMutation((loginDTO: LoginUserDTO) => api.logIn(loginDTO), {
    onSuccess: ({ data }) => {
      const { user, tokens } = data;
      const { accessToken, refreshToken } = tokens;

      setUser(user);

      if (accessToken) {
        localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);
      }

      if (refreshToken) {
        localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);
      }

      router.push('/');
    },
  });
};
