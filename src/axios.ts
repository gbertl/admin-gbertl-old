import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://gilbertlc-api.herokuapp.com/api'
    : 'http://localhost:8000/api';

const instance = axios.create({
  baseURL,
});

export default instance;
