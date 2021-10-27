import type { NextPage } from 'next';
import NextLink from 'next/link';
import { Box, Center, Heading, Link, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../shared/providers/ApiProvider';

const Home: NextPage = () => {
  const api = useContext(ApiContext);

  const mutation = useMutation(() => api.logOut());

  return (
    <Center w='100%' h='100vh' flexDir='column'>
      <Heading>NextJS/NestJS Template</Heading>
      <Box as='nav'>
        <NextLink href='/login' passHref>
          <Link mr='4'>Log In</Link>
        </NextLink>
        <NextLink href='/register' passHref>
          <Link mr='4'>Register</Link>
        </NextLink>
        <Button onClick={() => mutation.mutate()}>Log Out</Button>
      </Box>
    </Center>
  );
};

export default Home;
