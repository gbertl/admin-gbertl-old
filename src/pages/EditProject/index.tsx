import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Category, Project, Screenshot, Technology } from '../../typings';
import * as api from '../../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Container, Form, FloatingLabel, Button } from 'react-bootstrap';
import './style.scss';

const initialInputs = {
  id: 0,
  title: '',
  description: '',
  live_preview: '',
  source_code: '',
  priority_order: 0,
  technologies: [],
  categories: [],
  screenshots: [],
};

const EditProject = () => {
  const params = useParams();

  const queryClient = useQueryClient();

  const { data: project } = useQuery<Project, Error, Project, string[]>(
    ['project', params.id || ''],
    async ({ queryKey }) => (await api.getProject(parseInt(queryKey[1]))).data,
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

  const [inputs, setInputs] = useState<Project>(initialInputs);

  const [newTechnologies, setNewTechnologies] = useState<
    Omit<Technology, 'id'>[] | []
  >([]);

  const { mutateAsync: createTechnology } = useMutation(api.createTechnology);
  const {
    mutate: updateProject,
    isLoading,
    isSuccess,
  } = useMutation(api.updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(['project', params.id || '']);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!params.id) return;

    e.preventDefault();

    let newProject = { ...inputs };

    if (newTechnologies.length) {
      // create new technologies then add it to project
      const createTechs = async () => {
        let ids: number[] = [];

        for (const nt of newTechnologies) {
          const { data } = await createTechnology(nt);
          ids.push(data.id);
        }

        return Promise.resolve(ids);
      };

      const newTechIds = await createTechs();
      newProject.technologies = newProject.technologies.concat(newTechIds);

      setNewTechnologies([]);
      queryClient.invalidateQueries('technologies');
    }

    updateProject({ id: parseInt(params.id), project: newProject });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const name = target.name as keyof Project;
    let value: any;

    if (target.type === 'checkbox') {
      const currentArr = inputs[name];
      const currentValue = parseInt(target.value);

      if (!Array.isArray(currentArr)) return;

      value = target.checked
        ? currentArr.concat(currentValue)
        : currentArr.filter((arrValue) => arrValue !== currentValue);
    } else {
      value = target.value;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
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
            controlId="live_preview"
            label="Live preview"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="live_preview"
              value={inputs.live_preview}
              onChange={handleChange}
              placeholder="Live preview"
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="source_code"
            label="Source code"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="source_code"
              value={inputs.source_code}
              onChange={handleChange}
              placeholder="Source code"
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="priority_order"
            label="Priority order"
            className="mb-3"
          >
            <Form.Control
              type="number"
              name="priority_order"
              value={inputs.priority_order}
              onChange={handleChange}
              placeholder="Priority order"
            />
          </FloatingLabel>
          <Form.Group className="mb-3">
            <Form.Label className="d-block">Technologies</Form.Label>
            {technologies?.map((technology) => (
              <React.Fragment key={technology.id}>
                <Form.Check
                  type="checkbox"
                  name="technologies"
                  value={technology.id}
                  onChange={handleChange}
                  checked={inputs.technologies.includes(technology.id)}
                  label={technology.name}
                  id={`technologies-${technology.id}`}
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
              className="d-inline w-auto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-block">Categories</Form.Label>
            {categories?.map((category) => (
              <React.Fragment key={category.id}>
                <Form.Check
                  type="checkbox"
                  name="categories"
                  value={category.id}
                  onChange={handleChange}
                  checked={inputs.categories.includes(category.id)}
                  label={category.title}
                  id={`categories-${category.id}`}
                  inline
                />
              </React.Fragment>
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-block">Screenshots</Form.Label>
            {screenshots?.map((screenshot) => (
              <React.Fragment key={screenshot.id}>
                <Form.Check
                  inline
                  className="ps-0 position-relative project-form__screenshots"
                  type="checkbox"
                  id={`screenshots-${screenshot.id}`}
                >
                  <Form.Check.Input
                    name="screenshots"
                    value={screenshot.id}
                    onChange={handleChange}
                    checked={inputs.screenshots.includes(screenshot.id)}
                    className="project-form__screenshots-checkbox"
                  />
                  <Form.Check.Label>
                    <img
                      src={screenshot.image}
                      alt="project screenshot"
                      width={200}
                      className="img-fluid"
                    />
                  </Form.Check.Label>
                </Form.Check>
              </React.Fragment>
            ))}
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            Submit
          </Button>
          <small className="d-block mt-1">
            {isLoading && 'Please wait ...'}
            {isSuccess && 'Updated successfully!'}
          </small>
        </Form>
      </Container>
    </section>
  );
};

export default EditProject;
