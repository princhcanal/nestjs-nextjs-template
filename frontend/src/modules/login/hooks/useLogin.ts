import { useContext } from 'react';
import { useMutation } from 'react-query';
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
      const { user, accessToken, refreshToken } = data;

      setUser(user);
      localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);
      localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);

      router.push('/');
    },
  });
};
