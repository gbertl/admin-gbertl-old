import axios from '../axios';
import { useEffect, useState } from 'react';
import { Project } from '../typings';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { generatePath, Link } from 'react-router-dom';
import routes from '../routes';

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await axios.get(routes.projectsList);

      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section className="home">
      <Container>
        <Table striped>
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr>
                <td>{project.title}</td>
                <td>{project.priority_order}</td>
                <td className="d-flex gap-1">
                  <Link
                    to={generatePath(routes.projectsDetail, {
                      id: project.id.toString(),
                    })}
                    className="btn btn-info"
                  >
                    View
                  </Link>
                  <Link
                    to={generatePath(routes.projectsEdit, {
                      id: project.id.toString(),
                    })}
                    className="btn btn-warning"
                  >
                    Edit
                  </Link>
                  <Button variant="danger">Delete</Button>
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
