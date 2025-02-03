import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.jolpi.ca/ergast/f1',
});

export default api;
