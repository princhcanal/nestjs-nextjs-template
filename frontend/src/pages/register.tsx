import { Box, Button, Center, Flex, Link } from '@chakra-ui/react';
import { axiosInstance as axios } from '../shared/axios';
import type { NextPage } from 'next';
import React from 'react';
import NextLink from 'next/link';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import type { FormikProps, FieldProps } from 'formik';
import { Input } from '../components/shared/form/Input/Input';

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {
  const register = async (registerDTO: RegisterDTO) => {
    try {
      await axios.post('/auth/register', registerDTO);
    } catch (e) {
      throw new Error();
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (e) {
      throw new Error();
    }
  };

  const initialValues = { email: '', username: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  });

  return (
    <Center w='100%' h='100vh'>
      <Box bg='gray.200' p='8' borderRadius='md' w='xl'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={register}
        >
          {(props: FormikProps<RegisterDTO>) => (
            <Form>
              <Box mb='4'>
                <Field name='username'>
                  {(fieldProps: FieldProps<string, RegisterDTO>) => (
                    <Input
                      fieldProps={fieldProps}
                      name='username'
                      label='Username'
                      type='username'
                      id='username'
                      borderColor='gray.300'
                      bgColor='gray.50'
                      color='gray.800'
                    />
                  )}
                </Field>
                <Field name='email' type='email'>
                  {(fieldProps: FieldProps<string, RegisterDTO>) => (
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
                  {(fieldProps: FieldProps<string, RegisterDTO>) => (
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
                  isLoading={props.isSubmitting}
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
          <NextLink href='/login' passHref>
            <Link>Log In</Link>
          </NextLink>
        </Flex>
      </Box>
    </Center>
  );
};

export default Register;
