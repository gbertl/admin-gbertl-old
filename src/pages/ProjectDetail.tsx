import { useEffect, useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { Category, Project, Screenshot, Technology } from '../typings';
import axios from '../axios';
import routes from '../routes';
import { Container, ListGroup } from 'react-bootstrap';
import '../scss/components/project-detail.scss';
import * as api from '../api';

const ProjectDetail = () => {
  const params = useParams();
  const [project, setProject] = useState<Project>();
  const [screenshots, setScreenshots] = useState<Screenshot[]>();
  const [technologies, setTechnologies] = useState<Technology[]>();
  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return;
      const { data } = await api.getProject(params.id);
      setProject(data);
    };

    fetchProject();
  }, []);

  useEffect(() => {
    if (!project) return;

    const fetchAllRelated = async () => {
      const [
        { data: screenshotsData },
        { data: technologiesData },
        { data: categoriesData },
      ] = await Promise.all([
        api.getScreenshots(project.screenshots),
        api.getTechnologies(project.technologies),
        api.getCategories(project.categories),
      ]);
      setScreenshots(screenshotsData);
      setTechnologies(technologiesData);
      setCategories(categoriesData);
    };

    fetchAllRelated();
  }, [project]);

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
