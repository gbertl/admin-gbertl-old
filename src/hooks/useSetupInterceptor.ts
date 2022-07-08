import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { axiosPrivate } from '../axios';
import routes from '../routes';
import * as api from '../api';

const useSetupInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (error.response.status === 401) {
          if (location.pathname.includes(routes.login)) return;

          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            try {
              const { data } = await api.updateToken(refreshToken);
              config.headers['Authorization'] = `Bearer ${data.access}`;
              return axiosPrivate(config);
            } catch {
              navigate(routes.login, {
                state: {
                  from: location.pathname,
                },
              });
            }
          } else {
            navigate(routes.login, {
              state: {
                from: location.pathname,
              },
            });
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);
};

export default useSetupInterceptor;
