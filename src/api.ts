import { generatePath } from 'react-router-dom';
import routes from './routes';
import axios, { axiosPrivate } from './axios';
import { Project, Technology } from './typings';

export const updateProject = (id: number, project: Project) =>
  axiosPrivate.put(
    generatePath(routes.projectDetail, {
      id: id.toString(),
    }),
    project
  );

export const getProject = (id: number) =>
  axios.get(
    generatePath(routes.projectDetail, {
      id: id.toString(),
    })
  );

export const getTechnologies = (ids: number[] = []) =>
  axios.get(routes.technologyList, {
    params: {
      ids,
    },
  });

export const createTechnology = (technology: Omit<Technology, 'id'>) =>
  axiosPrivate.post(routes.technologyList, technology);

export const getCategories = (ids: number[] = []) =>
  axios.get(routes.categoryList, {
    params: {
      ids,
    },
  });

export const getScreenshots = (ids: number[] = []) =>
  axios.get(routes.screenshotList, {
    params: {
      ids,
    },
  });

export const deleteProject = (id: number) =>
  axiosPrivate.delete(
    generatePath(routes.projectDetail, { id: id.toString() })
  );

export const getProjects = (ordering: string[] = []) =>
  axios.get(routes.projectList, {
    params: {
      ordering,
    },
  });

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(routes.token, {
      username,
      password,
    });

    const { access, refresh } = response.data;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateToken = async (refresh: string) => {
  try {
    const response = await axios.post(routes.refreshToken, { refresh });
    const { access } = response.data;

    localStorage.setItem('accessToken', access);
    axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e);
  }
};
