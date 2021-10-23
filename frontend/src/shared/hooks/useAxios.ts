import { axiosInstance as axios } from '../axios';
import { useToast, UseToastOptions } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';

interface UseAxiosOptions {
  showToastOnError?: boolean;
  showToastOnSuccess?: boolean;
  toastStatus?: UseToastOptions['status'];
  toastTitle?: string;
  toastDescription?: string;
}

const DEFAULT_USE_AXIOS_OPTIONS = {
  showToastOnError: false,
  showToastOnSuccess: false,
};

export const useAxios = ({
  showToastOnError,
  showToastOnSuccess,
  toastStatus,
  toastTitle,
  toastDescription,
}: UseAxiosOptions = DEFAULT_USE_AXIOS_OPTIONS) => {
  const toast = useToast();

  axios.interceptors.response.use(
    (res: AxiosResponse<any>) => {
      if (res) {
        if (showToastOnSuccess) {
          const { message } = res.data;

          let description = '';

          if (message) {
            description = Array.isArray(message) ? message.join(', ') : message;
          }

          toast({
            status: toastStatus || 'success',
            title: toastTitle || 'Success!',
            description: toastDescription || description,
            isClosable: true,
            variant: 'subtle',
          });
        }
      }
    },
    (e: any) => {
      if (e) {
        if (showToastOnError) {
          const { message } = e.response.data;

          let description = '';

          if (message) {
            description = Array.isArray(message) ? message.join(', ') : message;
          }

          toast({
            status: toastStatus || 'error',
            title: toastTitle || 'Error!',
            description:
              toastDescription || description || 'Something wrong happened',
            isClosable: true,
            variant: 'subtle',
          });
        }
      }
    }
  );

  return axios;
};
