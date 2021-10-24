import { useContext } from 'react';
import { useMutation } from 'react-query';
import { LoginUserDTO } from 'generated-api';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useLogin = () => {
  const api = useContext(ApiContext);

  return useMutation((loginDTO: LoginUserDTO) => api.logIn(loginDTO));
};
