import { Box, Center, Flex } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { Navbar } from './Navbar';

export const Layout = (page: ReactElement) => {
  return (
    <Flex direction='row' minHeight='100vh'>
      <Navbar background='blackAlpha.900' width='xs' color='whiteAlpha.900' />

      <Box as='main' background='whiteAlpha.100' flex='1'>
        <Center height='full'>{page}</Center>
      </Box>
    </Flex>
  );
};
