import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApiProvider } from '../shared/providers/ApiProvider';
import { useGlobalStore } from '../shared/stores';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Layout } from '../shared/components/ui/Layout';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? Layout;
  const getUser = useGlobalStore((state) => state.getUser);
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const user = getUser();

    if (pageProps.protected && !user) {
      router.replace('/login');
    } else if (pageProps.dontShowUser && user) {
      router.replace('/');
    } else {
      setShowPage(true);
    }
  }, [getUser, pageProps, router]);

  return (
    <ChakraProvider>
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          {showPage && getLayout(<Component {...pageProps} />)}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ApiProvider>
    </ChakraProvider>
  );
}

export default MyApp;
