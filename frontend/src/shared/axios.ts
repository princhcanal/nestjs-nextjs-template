import axios from 'axios';

let reviewAppUrl;

if (process.env.NEXT_PUBLIC_VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `${process.env.NEXT_PUBLIC_PREVIEW_URL_PREFIX}${prNumber}.up.railway.app/api/v1`;
}

const suffix = '/api/v1';
const publicBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL + suffix;

const baseURL = publicBaseUrl || reviewAppUrl || 'http://localhost:3000/api/v1';

export const createAxiosInstance = () => {
  return axios.create({
    baseURL,
    withCredentials: true,
  });
};
