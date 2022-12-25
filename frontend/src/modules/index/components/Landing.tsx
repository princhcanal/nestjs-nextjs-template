import React from 'react';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Landing = () => {
  return (
    <VStack spacing={8}>
      <Heading>NextJS/NestJS Template</Heading>

      <HStack justify='center' spacing={8}>
        <NextLink href='/login'>Log In</NextLink>
        <NextLink href='/register'>Register</NextLink>
      </HStack>
    </VStack>
  );
};
