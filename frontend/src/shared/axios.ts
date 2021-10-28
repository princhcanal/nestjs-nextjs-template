import axios from 'axios';

let reviewAppUrl;

if (process.env.VERCEL_GIT_IS_PULL_REQUEST === '1') {
  const prNumber = process.env.VERCEL_GIT_PULL_REQUEST_NUMBER;
  reviewAppUrl = `https://nest-next-template-pr-${prNumber}.herokuapp.com`;
}

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  reviewAppUrl ||
  'http://localhost:3000/api/v1';

// tslint:disable:no-console
console.log('axios.ts');
// tslint:disable:no-console
console.log('is pr:', process.env.VERCEL_GIT_IS_PULL_REQUEST);
// tslint:disable:no-console
console.log('pr number:', process.env.VERCEL_GIT_PULL_REQUEST_NUMBER);
// tslint:disable:no-console
console.log('reviewAppUrl:', reviewAppUrl);
// tslint:disable:no-console
console.log('next public url:', process.env.NEXT_PUBLIC_BASE_URL);

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
