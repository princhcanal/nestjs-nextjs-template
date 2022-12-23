import { Box, ChakraProps } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { UrlObject } from 'url';

interface NavLinkProps {
  href: UrlObject | string;
}

export const NavLink: React.FC<
  NavLinkProps & ChakraProps & React.PropsWithChildren
> = ({ children, href, ...props }) => {
  const router = useRouter();

  const isActive = router.pathname === href;

  return (
    <Box
      as='li'
      listStyleType='none'
      {...props}
      fontSize='xl'
      fontWeight='semibold'
      _hover={{ background: 'whiteAlpha.400' }}
      transition='all 0.2s ease-in-out'
      width='full'
      borderRadius='md'
      py='1'
      px='4'
      background={isActive ? 'gray.700' : ''}
    >
      <Link href={href} style={{ display: 'block', width: '100%' }}>
        {children}
      </Link>
    </Box>
  );
};
