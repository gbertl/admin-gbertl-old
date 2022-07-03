import { Project } from '../typings';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { generatePath, Link } from 'react-router-dom';
import routes from '../routes';
import * as api from '../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Spinner } from 'react-bootstrap';

const Home = () => {
  const queryClient = useQueryClient();

  const { isLoading, data: projects } = useQuery<Project[], Error>(
    'projects',
    async () => (await api.getProjects(['priority_order'])).data
  );

  const { mutate: deleteProject } = useMutation(api.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure want to delete this?')) return;
    deleteProject(id);
  };

  return (
    <section className="home">
      <Container>
        {!isLoading ? (
          <Table responsive="sm" striped>
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects?.length ? (
                <>
                  {projects?.map((project) => (
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
                </>
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : (
          <Spinner animation="border" role="status" className="d-block mx-auto">
            <span className="visually-hidden">Loading ...</span>
          </Spinner>
        )}
      </Container>
    </section>
  );
};

export default Home;
