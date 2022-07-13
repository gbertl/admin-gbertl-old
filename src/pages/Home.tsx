import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { generatePath, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import routes from '../routes';
import * as api from '../api';
import { Project } from '../typings';

const Home = () => {
  const queryClient = useQueryClient();

  const { isLoading, data: projects } = useQuery<Project[], Error>(
    'projects',
    async () => (await api.getProjects(['priority_order'])).data
  );

  const {
    mutate: deleteProject,
    isError,
    error,
  } = useMutation<AxiosResponse, AxiosError, number>(api.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setShowPrompt(false);
    },
  });

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentProject, setCurrentProject] = useState<{
    id: number;
    title: string;
  }>();

  const handleShow = (id: number, title: string) => {
    setCurrentProject({ id, title });
    setShowPrompt(true);
  };

  const handleClose = () => setShowPrompt(false);

  const handleDelete = () => {
    if (!currentProject?.id) return;
    deleteProject(currentProject.id);
  };

  return (
    <>
      <section className="home">
        <Container>
          <Link to={routes.newProject} className="btn btn-primary mb-2">
            Add Project
          </Link>

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
                            onClick={() =>
                              handleShow(project.id, project.title)
                            }
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
            <Spinner
              animation="border"
              role="status"
              className="d-block mx-auto"
            >
              <span className="visually-hidden">Loading ...</span>
            </Spinner>
          )}
        </Container>
      </section>

      <Modal show={showPrompt} onHide={handleClose} centered>
        <Modal.Body className="text-center">
          Are you want to delete {currentProject?.title}?
        </Modal.Body>

        <div className="d-flex gap-2 justify-content-center mb-3">
          <Button variant="primary" onClick={handleDelete}>
            Yes
          </Button>

          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </div>

        {isError && (
          <small className="text-center text-danger mb-3">
            {error.message}
          </small>
        )}
      </Modal>
    </>
  );
};

export default Home;
