import { Box, Flex } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { Navbar } from './Navbar';

export const Layout = (page: ReactElement) => {
  return (
    <Flex direction='row' minHeight='100vh'>
      <Navbar
        backgroundColor='blackAlpha.400'
        width='xs'
        color='whiteAlpha.900'
      />

      <Box
        as='main'
        backgroundColor='gray.800'
        color='whiteAlpha.900'
        flex='1'
        h='100vh'
        overflowY='auto'
        p='6'
      >
        {page}
      </Box>
    </Flex>
  );
};
