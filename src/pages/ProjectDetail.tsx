import { useParams } from 'react-router-dom';
import { Category, Project, Screenshot, Technology } from '../typings';
import { Container, ListGroup } from 'react-bootstrap';
import '../scss/components/project-detail.scss';
import * as api from '../api';
import { useQuery } from 'react-query';

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
    async () => (await api.getScreenshots(project?.screenshots)).data,
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
            <span className="fw-bold">Screenshots</span>{' '}
            {screenshots?.map((screenshot) => (
              <img src={screenshot.image} alt="screenshot" width={200} />
            ))}
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </section>
  );
};

export default ProjectDetail;
