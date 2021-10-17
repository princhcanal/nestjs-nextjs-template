import type { NextPage } from 'next';
import NextLink from 'next/link';
import { Box, Center, Heading, Link } from '@chakra-ui/react';

// TODO: use React Query instead of just axios
const Home: NextPage = () => {
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
      </Box>
    </Center>
  );
};

export default Home;
