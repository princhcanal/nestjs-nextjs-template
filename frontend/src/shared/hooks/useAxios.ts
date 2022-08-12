import { axiosInstance as axios } from '../axios';
import { AlertStatus, useToast } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { LocalStorageKeys } from '../enums/localStorageKeys';
import { TokensDTO } from 'generated-api';

interface UseAxiosOptions {
  showToastOnError?: boolean;
  showToastOnSuccess?: boolean;
  toastStatus?: AlertStatus;
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

  axios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

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

      return res;
    },
    async (e: any) => {
      if (e) {
        const { message, statusCode, invalidRefreshToken } = e.response.data;
        const refreshToken = localStorage.getItem(
          LocalStorageKeys.REFRESH_TOKEN
        );

        if (refreshToken && statusCode === 401 && !invalidRefreshToken) {
          try {
            e.config._retry = true;

            const response = await axios.post<
              TokensDTO,
              AxiosResponse<TokensDTO>
            >('/auth/refresh', {
              refreshToken,
            });

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = response.data;

            if (newAccessToken) {
              localStorage.setItem(
                LocalStorageKeys.ACCESS_TOKEN,
                newAccessToken
              );
            }

            if (newRefreshToken) {
              localStorage.setItem(
                LocalStorageKeys.REFRESH_TOKEN,
                newRefreshToken
              );
            }

            return axios(e.config);
            // tslint:disable:no-empty
          } catch (e) {}
        }

        // if error that's not an invalidRefreshToken error
        if (showToastOnError && !invalidRefreshToken) {
          let description = '';

          if (message) {
            description = Array.isArray(message) ? message.join(', ') : message;
          }

          toast({
            status: toastStatus || 'error',
            title: toastTitle || 'Error!',
            description:
              toastDescription || description || 'Something went wrong',
            isClosable: true,
            variant: 'subtle',
          });
        }

        Promise.reject(e);
      }
    }
  );

  return axios;
};
