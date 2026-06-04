import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // send httpOnly JWT cookie automatically
});

export default axiosInstance;
