import { useEffect, useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { Project } from '../typings';
import axios from '../axios';
import routes from '../routes';
import { Container, ListGroup } from 'react-bootstrap';
import '../scss/components/project-detail.scss';

const ProjectDetail = () => {
  const params = useParams();
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await axios.get(
        generatePath(routes.projectsDetail, {
          id: params.id,
        })
      );

      setProject(data);
    };

    fetchProject();
  }, []);

  return (
    <section className="project-detail">
      <Container>
        <ListGroup className="project-detail__list">
          <ListGroup.Item>
            <span className="fw-bold">Title</span> {project?.title}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Description</span> {project?.description}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Live</span> {project?.live_preview}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Source</span> {project?.source_code}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Order</span> {project?.priority_order}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Techs</span>{' '}
            {project?.technologies.join(',')}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Categories</span>{' '}
            {project?.categories.join(',')}
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </section>
  );
};

export default ProjectDetail;
