import { Center, Heading, Button } from '@chakra-ui/react';
import React from 'react';
import { useLogout } from '../hooks/useLogout';

export const Home = () => {
  const logout = useLogout().mutate;

  return (
    <Center w='100%' h='100vh' flexDir='column'>
      <Heading>Home</Heading>
      <Button onClick={() => logout()}>Log Out</Button>
    </Center>
  );
};
