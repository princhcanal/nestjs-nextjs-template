import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ApiProvider } from '../shared/providers/ApiProvider';
import { useGlobalStore } from '../shared/stores';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const getUser = useGlobalStore((state) => state.getUser);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();

    // FIXME: routes flash
    if (pageProps.protected && !user) {
      router.replace('/login');
    }

    if (pageProps.dontShowUser && user) {
      router.replace('/');
    }
  }, [getUser, pageProps, router]);

  return (
    <ChakraProvider>
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ApiProvider>
    </ChakraProvider>
  );
}

export default MyApp;
