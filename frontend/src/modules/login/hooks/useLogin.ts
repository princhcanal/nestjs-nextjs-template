import { useAxios } from '../../../shared/hooks/useAxios';
import { useMutation } from 'react-query';
import { AxiosInstance } from 'axios';

export interface LoginDTO {
  email: string;
  password: string;
}

const login = async (axios: AxiosInstance, loginDTO: LoginDTO) => {
  await axios.post('/auth/login', loginDTO);
};

export const useLogin = () => {
  const axios = useAxios({ showToastOnError: true });

  return useMutation((loginDTO: LoginDTO) => login(axios, loginDTO));
};
