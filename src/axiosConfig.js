import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://crm-backend-bma.onrender.com/api', 
  // baseURL: 'http://localhost:5000/api',
});

export default instance;