import { Box, ChakraProps, Heading, VStack } from '@chakra-ui/react';
import { NavLink } from './NavLink';

export const Navbar = (props: ChakraProps) => {
  return (
    <Box as='nav' {...props} px='12'>
      <Heading py='8'>Logo Here</Heading>

      <VStack as='ul' alignItems='flex-start'>
        <NavLink href='/login'>Login</NavLink>
        <NavLink href='/register'>Register</NavLink>
      </VStack>
    </Box>
  );
};
