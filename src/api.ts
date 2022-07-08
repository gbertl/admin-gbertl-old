import { generatePath } from 'react-router-dom';

import routes from './routes';
import axios, { axiosPrivate } from './axios';
import { UserLogin, Project, Technology, Screenshot } from './typings';

export const updateProject = ({
  id,
  project,
}: {
  id: number;
  project: Project;
}) =>
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

export const getScreenshots = (ids: number[] = [], ordering: string[] = []) =>
  axios.get(routes.screenshotList, {
    params: {
      ids,
      ordering,
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

export const createScreenshot = (screenshot: Omit<Screenshot, 'id'>) => {
  const fd = new FormData();
  fd.append('image', screenshot.image);
  fd.append('project', screenshot.project.toString());
  return axiosPrivate.post(routes.screenshotList, fd);
};
