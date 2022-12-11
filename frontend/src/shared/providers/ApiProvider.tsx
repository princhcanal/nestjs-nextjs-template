import { createContext } from 'react';
import { useAxios } from '../hooks/useAxios';
import { DefaultApi } from 'generated-api';

let reviewAppUrl;

if (process.env.NEXT_PUBLIC_VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `${process.env.NEXT_PUBLIC_PREVIEW_URL_PREFIX}${prNumber}.up.railway.app`;
}

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || reviewAppUrl || 'http://localhost:3000';

export const ApiContext = createContext<DefaultApi>(new DefaultApi());

export const ApiProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const axios = useAxios({ showToastOnError: true });

  const api = new DefaultApi(undefined, baseURL, axios);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
