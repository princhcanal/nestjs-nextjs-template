import { useMutation } from 'react-query';
import { RegisterUserDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useRouter } from 'next/router';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  useGlobalStore,
} from '../../../shared/stores';

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
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);

        router.push('/');
      },
    }
  );
};
