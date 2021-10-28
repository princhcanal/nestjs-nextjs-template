import { createContext, ReactNode } from 'react';
import { useAxios } from '../hooks/useAxios';
import { DefaultApi } from 'generated-api';

let reviewAppUrl;

if (process.env.VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `https://nest-next-template-pr-${prNumber}.herokuapp.com`;
}

reviewAppUrl = `https://nest-next-template-pr-${26}.herokuapp.com`;

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || reviewAppUrl || 'http://localhost:3000';

// tslint:disable:no-console
console.log('ApiProvider.tsx');
// tslint:disable:no-console
console.log('is pr:', process.env.VERCEL_GIT_IS_PULL_REQUEST);
// tslint:disable:no-console
console.log('pr number:', process.env.VERCEL_GIT_PULL_REQUEST_NUMBER);
// tslint:disable:no-console
console.log('reviewAppUrl:', reviewAppUrl);
// tslint:disable:no-console
console.log('next public url:', process.env.NEXT_PUBLIC_BASE_URL);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiContext = createContext<DefaultApi>(new DefaultApi());

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const axios = useAxios({ showToastOnError: true });

  const api = new DefaultApi(undefined, baseURL, axios);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
