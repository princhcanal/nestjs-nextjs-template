import { createContext, ReactNode } from 'react';
import { useAxios } from '../hooks/useAxios';
import { DefaultApi } from 'generated-api';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiContext = createContext<DefaultApi>(new DefaultApi());

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const axios = useAxios({ showToastOnError: true });

  const api = new DefaultApi(undefined, baseURL, axios);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
