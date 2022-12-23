import { Center } from '@chakra-ui/react';
import { ReactElement } from 'react';

export const CenterLayout = (page: ReactElement) => {
  return (
    <Center h='100vh' w='full'>
      {page}
    </Center>
  );
};
