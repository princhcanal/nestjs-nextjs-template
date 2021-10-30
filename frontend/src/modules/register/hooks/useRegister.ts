import { useMutation } from 'react-query';
import { RegisterUserDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useRouter } from 'next/router';
import { useGlobalStore } from '../../../shared/stores';
import { LocalStorageKeys } from '../../../shared/enums/localStorageKeys';

export const useRegister = () => {
  const api = useContext(ApiContext);
  const setUser = useGlobalStore((state) => state.setUser);
  const router = useRouter();

  return useMutation(
    (registerDTO: RegisterUserDTO) => api.register(registerDTO),
    {
      onSuccess: ({ data }) => {
        const { user, accessToken, refreshToken } = data;

        setUser(user);
        localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);
        localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);

        router.push('/');
      },
    }
  );
};
