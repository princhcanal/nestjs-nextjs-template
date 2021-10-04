import axios from 'axios';

const baseURL = process.env.BASE_URL || 'http://localhost:5000/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
