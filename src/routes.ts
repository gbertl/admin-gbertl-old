const routes = {
  home: '/',
  projectsList: '/projects',
  get projectsDetail() {
    return `${this.projectsList}/:id`;
  },
  get projectsEdit() {
    return `${this.projectsDetail}/edit`;
  },
};

export default routes;
