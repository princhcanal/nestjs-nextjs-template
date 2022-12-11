import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { FieldProps, Field, Form, Formik } from 'formik';
import { Input } from '../../../shared/components/form/Input/Input';
import React from 'react';
import { useLogin } from '../hooks/useLogin';
import * as Yup from 'yup';
import NextLink from 'next/link';
import { LoginUserDTO } from 'generated-api';

export const LoginForm = () => {
  const mutation = useLogin();

  const onSubmit = (loginDTO: LoginUserDTO) => {
    mutation.mutate(loginDTO);
  };

  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  return (
    <Box bg='gray.200' p='8' borderRadius='md' w='xl'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form noValidate>
            <Box mb='4'>
              <Field name='email' type='email'>
                {(fieldProps: FieldProps<string, LoginUserDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='email'
                    label='Email'
                    type='email'
                    id='email'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
              <Field name='password' type='password'>
                {(fieldProps: FieldProps<string, LoginUserDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
            </Box>
            <Box mb='4'>
              <Button
                data-cy='login-submit-btn'
                formNoValidate
                type='submit'
                isLoading={mutation.isLoading}
                width='full'
                bgColor='gray.800'
                color='gray.50'
                _hover={{ bgColor: 'gray.800', color: 'gray.50' }}
              >
                Log In
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <Flex justifyContent='right' color='gray.500'>
        <NextLink href='/register' passHref>
          <Link>Register</Link>
        </NextLink>
      </Flex>
    </Box>
  );
};
