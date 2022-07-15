const routes = {
  login: '/login',
  token: '/token/',
  get refreshToken() {
    return `${this.token}refresh/`;
  },
  home: '/',
  projectList: '/projects/',
  get newProject() {
    return `${this.projectList}new`;
  },
  get projectDetail() {
    return `${this.projectList}:id/`;
  },
  get projectEdit() {
    return `${this.projectDetail}edit`;
  },
  technologyList: '/technologies/',
  categoryList: '/categories',
  screenshotList: '/screenshots/',
  get screenshotDetail() {
    return `${this.screenshotList}:id/`;
  },
};

export default routes;
