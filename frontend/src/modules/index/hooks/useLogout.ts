import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useGlobalStore } from '../../../shared/stores';

export const useLogout = () => {
  const api = useContext(ApiContext);
  const removeUser = useGlobalStore((state) => state.removeUser);
  const router = useRouter();

  return useMutation(() => api.logOut(), {
    onSuccess: () => {
      removeUser();
      router.push('/login');
    },
  });
};
