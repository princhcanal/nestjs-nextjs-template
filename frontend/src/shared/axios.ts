import axios from 'axios';

let reviewAppUrl;

if (process.env.NEXT_PUBLIC_VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `https://nest-next-template-pr-${prNumber}.herokuapp.com`;
}

// tslint:disable:no-console
console.log('vercel_url:', process.env.VERCEL_URL);
console.log('next_public_vercel_url:', process.env.NEXT_PUBLIC_VERCEL_URL);

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  reviewAppUrl ||
  'http://localhost:3000/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
