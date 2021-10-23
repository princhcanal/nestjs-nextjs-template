import { AxiosInstance } from 'axios';
import { useMutation } from 'react-query';
import { useAxios } from '../../../shared/hooks/useAxios';

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

const register = async (axios: AxiosInstance, registerDTO: RegisterDTO) => {
  await axios.post('/auth/register', registerDTO);
};

export const useRegister = () => {
  const axios = useAxios({ showToastOnError: true });

  return useMutation((registerDTO: RegisterDTO) =>
    register(axios, registerDTO)
  );
};
