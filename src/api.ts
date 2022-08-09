import { generatePath } from 'react-router-dom';

import routes from './routes';
import axios, { axiosPrivate } from './axios';
import { UserLogin, Technology, Screenshot } from './typings';
import { Inputs } from './pages/ProjectForm';

export const createProject = (project: Inputs) =>
  axiosPrivate.post(routes.projectList, project);

export const updateProject = ({
  id,
  project,
}: {
  id: string;
  project: Inputs;
}) =>
  axiosPrivate.put(
    generatePath(routes.projectDetail, {
      id: id.toString(),
    }),
    project
  );

export const getProject = (id: string) =>
  axios.get(
    generatePath(routes.projectDetail, {
      id: id.toString(),
    })
  );

export const getTechnologies = (ids: string[] = []) =>
  axios.get(routes.technologyList, {
    params: {
      ids,
    },
  });

export const createTechnology = (technology: Omit<Technology, '_id'>) =>
  axiosPrivate.post(routes.technologyList, technology);

export const getCategories = (ids: string[] = []) =>
  axios.get(routes.categoryList, {
    params: {
      ids,
    },
  });

export const getScreenshots = (ids: string[] = [], ordering: string[] = []) =>
  axios.get(routes.screenshotList, {
    params: {
      ids,
      ordering,
    },
  });

export const deleteProject = (id: string) =>
  axiosPrivate.delete(
    generatePath(routes.projectDetail, { id: id.toString() })
  );

export const getProjects = (ordering: string[] = []) =>
  axios.get(routes.projectList, {
    params: {
      ordering,
    },
  });

export const login = async ({ username, password }: UserLogin) => {
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

export const createScreenshot = ({
  image,
  project,
}: Omit<Screenshot, '_id'>) => {
  return axiosPrivate.post(routes.screenshotList, { image, project });
};

export const deleteScreenshot = async (id: string) =>
  axiosPrivate.delete(generatePath(routes.screenshotDetail, { id }));
