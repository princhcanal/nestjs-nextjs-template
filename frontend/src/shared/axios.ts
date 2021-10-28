import axios from 'axios';

const baseURL =
  process.env.BASE_URL + '/api/v1' || 'http://localhost:3000/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
