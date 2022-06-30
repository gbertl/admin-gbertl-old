import { useEffect, useState } from 'react';
import { Project } from '../typings';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { generatePath, Link } from 'react-router-dom';
import routes from '../routes';
import * as api from '../api';

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure want to delete this?')) return;
    await api.deleteProject(id.toString());
    setProjects(projects.filter((project) => project.id !== id));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await api.getProjects(['priority_order']);
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section className="home">
      <Container>
        <Table responsive="sm" striped>
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.priority_order}</td>
                <td className="d-flex gap-1">
                  <Link
                    to={generatePath(routes.projectDetail, {
                      id: project.id.toString(),
                    })}
                    className="btn btn-info"
                  >
                    View
                  </Link>
                  <Link
                    to={generatePath(routes.projectEdit, {
                      id: project.id.toString(),
                    })}
                    className="btn btn-warning"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </section>
  );
};

export default Home;
