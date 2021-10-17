import React from 'react';
import type { FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';

interface InputProps {
  fieldProps: FieldProps;
  label?: string;
}

export const Input = ({
  fieldProps: { field, form },
  label,
  ...props
}: InputProps & ChakraInputProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired
    mb='4'
  >
    {!!label && (
      <FormLabel
        htmlFor={props.id}
        mb='2'
        color='gray.800'
        fontWeight='semibold'
      >
        {label}
      </FormLabel>
    )}
    <ChakraInput {...field} {...props} />
    <FormErrorMessage>{form.errors[props.name!]}</FormErrorMessage>
  </FormControl>
);
