import { useMutation } from 'react-query';
import { RegisterUserDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useRouter } from 'next/router';
import { useGlobalStore } from '../../../shared/stores';

export const useRegister = () => {
  const api = useContext(ApiContext);
  const setUser = useGlobalStore((state) => state.setUser);
  const router = useRouter();

  return useMutation(
    (registerDTO: RegisterUserDTO) => api.register(registerDTO),
    {
      onSuccess: ({ data: user }) => {
        setUser(user);
        router.push('/');
      },
    }
  );
};
