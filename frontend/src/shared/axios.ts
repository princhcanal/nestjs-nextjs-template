import axios from 'axios';

let reviewAppUrl;

// tslint:disable:no-console
console.log('isPr:', process.env.NEXT_PUBLIC_VERCEL_GIT_IS_PULL_REQUEST);
console.log(
  'prNumber:',
  process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_NUMBER
);

if (process.env.NEXT_PUBLIC_VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `https://nest-next-template-pr-${prNumber}.herokuapp.com`;
}

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  reviewAppUrl ||
  'http://localhost:3000/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
