import { createContext, ReactNode } from 'react';
import { useAxios } from '../hooks/useAxios';
import { DefaultApi } from 'generated-api';

let reviewAppUrl;

if (process.env.VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `https://nest-next-template-pr-${prNumber}.herokuapp.com`;
}

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || reviewAppUrl || 'http://localhost:3000';

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiContext = createContext<DefaultApi>(new DefaultApi());

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const axios = useAxios({ showToastOnError: true });

  const api = new DefaultApi(undefined, baseURL, axios);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
