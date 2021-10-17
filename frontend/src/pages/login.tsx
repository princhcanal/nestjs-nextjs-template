import type { NextPage } from 'next';
import { Button, Center, Box, Flex, Link } from '@chakra-ui/react';
import { axiosInstance as axios } from '../shared/axios';
import NextLink from 'next/link';
import { Formik, Field, Form } from 'formik';
import type { FormikProps, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Input } from '../components/shared/form/Input/Input';
import React from 'react';

interface LoginDTO {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const login = async (loginDTO: LoginDTO) => {
    try {
      await axios.post('/auth/login', loginDTO);
    } catch (e) {
      throw new Error();
    }
  };

  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  return (
    <Center w='100%' h='100vh'>
      <Box bg='gray.200' p='8' borderRadius='md' w='xl'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={login}
        >
          {({ isSubmitting }: FormikProps<LoginDTO>) => (
            <Form>
              <Box mb='4'>
                <Field name='email' type='email'>
                  {(fieldProps: FieldProps<string, LoginDTO>) => (
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
                  {(fieldProps: FieldProps<string, LoginDTO>) => (
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
                  type='submit'
                  isLoading={isSubmitting}
                  isFullWidth
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
    </Center>
  );
};

export default Login;
