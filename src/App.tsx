import { Route, Routes } from 'react-router-dom';

import ProjectForm from './pages/ProjectForm';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import routes from './routes';
import Layout from './Layout';
import Login from './pages/Login';
import useSetupInterceptor from './hooks/useSetupInterceptor';

const App = () => {
  useSetupInterceptor();

  return (
    <Layout>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.newProject} element={<ProjectForm />} />
        <Route path={routes.projectEdit} element={<ProjectForm />} />
        <Route path={routes.projectDetail} element={<ProjectDetail />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </Layout>
  );
};

export default App;
