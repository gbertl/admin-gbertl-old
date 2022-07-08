import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import { useQuery } from 'react-query';

import './style.scss';
import * as api from '../../api';
import { Category, Project, Screenshot, Technology } from '../../typings';

const ProjectDetail = () => {
  const params = useParams();
  const { data: project } = useQuery<Project, Error, Project, string[]>(
    ['project', params.id || ''],
    async ({ queryKey }) => (await api.getProject(parseInt(queryKey[1]))).data,
    {
      enabled: !!params.id,
    }
  );

  const { data: screenshots } = useQuery<Screenshot[], Error>(
    ['screenshots', params.id],
    async () =>
      (await api.getScreenshots(project?.screenshots, ['priority_order'])).data,
    {
      enabled: !!project?.screenshots.length,
    }
  );

  const { data: technologies } = useQuery<Technology[], Error>(
    ['technologies', params.id],
    async () => (await api.getTechnologies(project?.technologies)).data,
    {
      enabled: !!project?.technologies.length,
    }
  );

  const { data: categories } = useQuery<Category[], Error>(
    ['categories', params.id],
    async () => (await api.getCategories(project?.categories)).data,
    {
      enabled: !!project?.categories.length,
    }
  );

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
            <span className="fw-bold">Live preview</span>{' '}
            {project?.live_preview}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Source code</span> {project?.source_code}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Priority order</span>{' '}
            {project?.priority_order}
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Technologies</span>{' '}
            <ul>
              {technologies?.map((technology) => (
                <li>{technology.name}</li>
              ))}
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <span className="fw-bold">Categories</span>{' '}
            <ul>
              {categories?.map((category) => (
                <li>{category.title}</li>
              ))}
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="fw-bold mb-1">Screenshots</div>
            <div className="d-flex gap-2 flex-wrap">
              {screenshots?.map((screenshot) => (
                <img
                  src={
                    typeof screenshot.image === 'string' ? screenshot.image : ''
                  }
                  alt="screenshot"
                  width={200}
                />
              ))}
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </section>
  );
};

export default ProjectDetail;
