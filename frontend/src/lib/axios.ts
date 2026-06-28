import axios from 'axios';

// In production (EC2), VITE_API_BASE_URL is set to http://<BACKEND_EC2_IP>:5001
// In local dev, it is empty and falls back to '/api' (handled by the Vite dev proxy)
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // send httpOnly JWT cookie automatically
});

export default axiosInstance;

