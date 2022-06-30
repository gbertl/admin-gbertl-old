import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://gilbertlc-api.herokuapp.com/api'
    : 'http://localhost:8000/api';

export const axiosPrivate = axios.create({
  baseURL,
});

axiosPrivate.defaults.headers.common[
  'Authorization'
] = `Bearer ${localStorage.getItem('accessToken')}`;

export default axios.create({
  baseURL,
});
