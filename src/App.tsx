import { Route, Routes } from 'react-router-dom';
import EditProject from './pages/EditProject';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import routes from './routes';
import Layout from './Layout';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.projectsEdit} element={<EditProject />} />
        <Route path={routes.projectsDetail} element={<ProjectDetail />} />
      </Routes>
    </Layout>
  );
};

export default App;
