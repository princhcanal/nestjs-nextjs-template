import axios from 'axios';

const baseURL =
  process.env.BASE_URL_WITH_VERSION || 'http://localhost:5000/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
