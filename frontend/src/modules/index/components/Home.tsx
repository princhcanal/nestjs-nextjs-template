import { Center, Heading, Button } from '@chakra-ui/react';
import React from 'react';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useLogout } from '../hooks/useLogout';

export const Home = () => {
  const logout = useLogout().mutate;
  const axios = useAxios();

  const test = () => {
    axios.get('/auth/test');
  };

  return (
    <Center w='100%' h='100vh' flexDir='column'>
      <Heading data-cy='home'>Home</Heading>
      <Button onClick={() => logout()}>Log Out</Button>
      <Button onClick={() => test()}>Test</Button>
    </Center>
  );
};
