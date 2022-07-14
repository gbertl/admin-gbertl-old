import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';

import './style.scss';
import { Category, Project, Screenshot, Technology } from '../../typings';
import * as api from '../../api';

export interface Inputs extends Omit<Project, '_id'> {
  _id?: string;
}

const initialInputs = {
  title: '',
  description: '',
  livePreview: '',
  sourceCode: '',
  priorityOrder: 0,
  technologies: [],
  categories: [],
  screenshots: [],
};

const ProjectForm = () => {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: project } = useQuery<Project, Error, Project, string[]>(
    ['project', params.id || ''],
    async ({ queryKey }) => (await api.getProject(queryKey[1])).data,
    { enabled: !!params.id }
  );

  const { data: technologies } = useQuery<Technology[], Error>(
    'technologies',
    async () => (await api.getTechnologies()).data
  );

  const { data: categories } = useQuery<Category[], Error>(
    'categories',
    async () => (await api.getCategories()).data
  );

  const { data: screenshots } = useQuery<Screenshot[], Error>(
    'screenshots',
    async () => (await api.getScreenshots()).data
  );

  const [inputs, setInputs] = useState<Inputs>(initialInputs);

  const [newTechnologies, setNewTechnologies] = useState<
    Omit<Technology, '_id'>[] | []
  >([]);

  const [newScreenshots, setNewScreenshots] = useState<
    Omit<Screenshot, '_id'>[]
  >([]);

  const { mutateAsync: createTechnology } = useMutation(api.createTechnology);

  const {
    mutate: createProject,
    isSuccess,
    isError,
    error,
  } = useMutation<AxiosResponse, AxiosError, Inputs>(api.createProject, {
    onSuccess: () => {
      setIsLoading(false);
      setInputs(initialInputs);
    },
  });

  const {
    mutate: updateProject,
    isSuccess: isUpdated,
    isError: isUpdatedError,
    error: updatedError,
  } = useMutation<AxiosResponse, AxiosError, { id: string; project: Inputs }>(
    api.updateProject,
    {
      onSuccess: () => {
        setIsLoading(false);
        queryClient.invalidateQueries(['project', params.id || '']);
      },
    }
  );

  const { mutateAsync: createScreenshot } = useMutation(api.createScreenshot);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newProject = { ...inputs };

    setIsLoading(true);

    if (newTechnologies.length) {
      // create new technologies then add it to project
      const createTechs = async () => {
        let ids: string[] = [];

        for (const nt of newTechnologies) {
          const { data } = await createTechnology(nt);
          ids.push(data._id);
        }

        return Promise.resolve(ids);
      };

      const newTechIds = await createTechs();
      newProject.technologies = newProject.technologies.concat(newTechIds);

      setNewTechnologies([]);
      queryClient.invalidateQueries('technologies');
    }

    if (newScreenshots.length) {
      const createScs = async () => {
        let ids: string[] = [];

        for (const ns of newScreenshots) {
          const { data } = await createScreenshot(ns);
          ids.push(data._id);
        }

        return Promise.resolve(ids);
      };

      const newScIds = await createScs();
      newProject.screenshots = newProject.screenshots.concat(newScIds);

      setNewScreenshots([]);
      queryClient.invalidateQueries('screenshots');
    }

    if (params.id) {
      updateProject({ id: params.id, project: newProject });
    } else {
      createProject(newProject);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const name = target.name as keyof Project;
    let value: any;

    if (target.type === 'checkbox') {
      const currentArr = inputs[name];

      if (!Array.isArray(currentArr)) return;

      value = target.checked
        ? currentArr.concat(target.value)
        : currentArr.filter((arrValue) => arrValue !== target.value);
    } else {
      value = target.value;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleNewScreenshots = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ns: Omit<Screenshot, '_id'> = { image: e.target.files?.[0] || '' };
    setNewScreenshots([...newScreenshots, ns]);
    e.target.value = '';
  };

  useEffect(() => {
    if (!project) return;
    setInputs({ ...project });
  }, [project]);

  return (
    <section className="project-form mb-5">
      <Container>
        <Form onSubmit={handleSubmit} className="project-form__form">
          <FloatingLabel controlId="title" label="Title" className="mb-3">
            <Form.Control
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              placeholder="Title"
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="description"
            label="Description"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={inputs.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="livePreview"
            label="Live preview"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="livePreview"
              value={inputs.livePreview}
              onChange={handleChange}
              placeholder="Live preview"
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="sourceCode"
            label="Source code"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="sourceCode"
              value={inputs.sourceCode}
              onChange={handleChange}
              placeholder="Source code"
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="priorityOrder"
            label="Priority order"
            className="mb-3"
          >
            <Form.Control
              type="number"
              name="priorityOrder"
              value={inputs.priorityOrder}
              onChange={handleChange}
              placeholder="Priority order"
            />
          </FloatingLabel>
          <Form.Group className="mb-3">
            <Form.Label className="d-block">Technologies</Form.Label>
            {technologies?.map((technology) => (
              <React.Fragment key={technology._id}>
                <Form.Check
                  type="checkbox"
                  name="technologies"
                  value={technology._id}
                  onChange={handleChange}
                  checked={inputs.technologies.includes(technology._id)}
                  label={technology.name}
                  id={`technologies-${technology._id}`}
                  inline
                />
              </React.Fragment>
            ))}

            {newTechnologies.map((newTechnology, idx) => (
              <React.Fragment key={idx}>
                <Form.Check
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) return;
                    setNewTechnologies(
                      newTechnologies.filter(
                        (nt) => nt.name !== newTechnology.name
                      )
                    );
                  }}
                  checked={true}
                  label={newTechnology.name}
                  id={`newTechnologies-${idx}`}
                  inline
                />
              </React.Fragment>
            ))}
            <Form.Control
              size="sm"
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setNewTechnologies([
                    ...newTechnologies,
                    { name: (e.target as HTMLInputElement).value },
                  ]);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="w-auto mt-1"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-block">Categories</Form.Label>
            {categories?.map((category) => (
              <React.Fragment key={category._id}>
                <Form.Check
                  type="checkbox"
                  name="categories"
                  value={category._id}
                  onChange={handleChange}
                  checked={inputs.categories.includes(category._id)}
                  label={category.title}
                  id={`categories-${category._id}`}
                  inline
                />
              </React.Fragment>
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-block">Screenshots</Form.Label>
            {screenshots?.map((screenshot) => (
              <React.Fragment key={screenshot._id}>
                <Form.Check
                  inline
                  className="ps-0 position-relative project-form__screenshots"
                  type="checkbox"
                  id={`screenshots-${screenshot._id}`}
                >
                  <Form.Check.Input
                    name="screenshots"
                    value={screenshot._id}
                    onChange={handleChange}
                    checked={inputs.screenshots.includes(screenshot._id)}
                    className="project-form__screenshots-checkbox"
                  />
                  <Form.Check.Label>
                    <img
                      src={
                        typeof screenshot.image === 'string'
                          ? screenshot.image
                          : ''
                      }
                      alt="project screenshot"
                      width={200}
                      className="img-fluid"
                    />
                  </Form.Check.Label>
                </Form.Check>
              </React.Fragment>
            ))}
            {newScreenshots.map((newScreenshot, idx) => (
              <React.Fragment key={idx}>
                <Form.Check
                  inline
                  className="ps-0 position-relative project-form__screenshots"
                  type="checkbox"
                  id={`newScreenshots-${idx}`}
                >
                  <Form.Check.Input
                    onChange={() =>
                      setNewScreenshots(
                        newScreenshots.filter(
                          (ns) => ns.image !== newScreenshot.image
                        )
                      )
                    }
                    checked={true}
                    className="project-form__screenshots-checkbox"
                  />
                  <Form.Check.Label>
                    <img
                      src={
                        typeof newScreenshot.image !== 'string'
                          ? URL.createObjectURL(newScreenshot.image)
                          : ''
                      }
                      alt="project newScreenshot"
                      width={200}
                      className="img-fluid"
                    />
                  </Form.Check.Label>
                </Form.Check>
              </React.Fragment>
            ))}
            <Form.Control
              type="file"
              onChange={handleNewScreenshots}
              size="sm"
              className="w-auto mt-1"
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            Submit
          </Button>
          <small className="d-block mt-1">
            {isLoading
              ? 'Please wait ...'
              : isSuccess
              ? 'Created successfully!'
              : isError
              ? error.message
              : isUpdated
              ? 'Update successfully'
              : isUpdatedError
              ? updatedError.message
              : ''}
          </small>
        </Form>
      </Container>
    </section>
  );
};

export default ProjectForm;
