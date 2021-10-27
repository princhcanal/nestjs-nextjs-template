import React from 'react';
import NextLink from 'next/link';
import { Center, Heading, Box, Link } from '@chakra-ui/react';

export const Landing = () => {
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
