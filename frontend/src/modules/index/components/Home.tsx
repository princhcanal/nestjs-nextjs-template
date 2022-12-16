import { Heading, Button } from '@chakra-ui/react';
import React from 'react';
import { useLogout } from '../hooks/useLogout';

export const Home = () => {
  const logout = useLogout().mutate;

  return (
    <>
      <Heading>Home</Heading>
      <Button onClick={() => logout()}>Log Out</Button>
    </>
  );
};
