import axios from 'axios';

const BASE_URLS = [
  'https://crm-backend-bma.onrender.com/api',
  'http://localhost:5000/api',
];
const defaultIndex = window.location.hostname === 'localhost' ? 1 : 0;

const axiosInstance = axios.create({
  baseURL: BASE_URLS[defaultIndex],
  timeout: 12000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

axiosInstance.interceptors.response.use(
  r => r,
  async (err) => {
    const cfg = err.config || {};
    const idx = cfg.__idx ?? defaultIndex;
    const retryable = !err.response || err.code === 'ECONNABORTED' || (err.response.status >= 500);
    if (retryable && idx < BASE_URLS.length - 1 && !cfg.__fellBack) {
      cfg.__fellBack = true;
      cfg.__idx = idx + 1;
      cfg.baseURL = BASE_URLS[idx + 1];
      console.warn(`[API] Fallback → ${cfg.baseURL}`);
      return axiosInstance(cfg);
    }
    throw err;
  }
);

export default axiosInstance;