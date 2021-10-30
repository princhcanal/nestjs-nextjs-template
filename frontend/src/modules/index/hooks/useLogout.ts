import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  useGlobalStore,
} from '../../../shared/stores';

export const useLogout = () => {
  const api = useContext(ApiContext);
  const removeUser = useGlobalStore((state) => state.removeUser);
  const router = useRouter();
  const user = useGlobalStore((state) => state.getUser)()!;

  return useMutation(() => api.logOut(user), {
    onSuccess: () => {
      removeUser();

      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);

      router.push('/login');
    },
  });
};
