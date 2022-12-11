import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LocalStorageKeys } from '../../../shared/enums/localStorageKeys';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useGlobalStore } from '../../../shared/stores';

export const useLogout = () => {
  const api = useContext(ApiContext);
  const removeUser = useGlobalStore((state) => state.removeUser);
  const router = useRouter();
  const user = useGlobalStore((state) => state.getUser)()!;

  return useMutation(() => api.logOut(user), {
    onSuccess: () => {
      removeUser();

      localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
      localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);

      router.push('/login');
    },
  });
};
