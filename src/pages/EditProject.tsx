import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Category, Project, Screenshot, Technology } from '../typings';
import * as api from '../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="title"
          value={inputs.title}
          onChange={handleChange}
          placeholder="title"
        />
      </div>
      <div>
        <input
          type="text"
          name="description"
          value={inputs.description}
          onChange={handleChange}
          placeholder="description"
        />
      </div>
      <div>
        <input
          type="text"
          name="live_preview"
          value={inputs.live_preview}
          onChange={handleChange}
          placeholder="live_preview"
        />
      </div>
      <div>
        <input
          type="text"
          name="source_code"
          value={inputs.source_code}
          onChange={handleChange}
          placeholder="source_code"
        />
      </div>
      <div>
        <input
          type="number"
          name="priority_order"
          value={inputs.priority_order}
          onChange={handleChange}
          placeholder="priority_order"
        />
      </div>
      <div>
        {technologies?.map((technology) => (
          <React.Fragment key={technology.id}>
            <input
              type="checkbox"
              name="technologies"
              value={technology.id}
              onChange={handleChange}
              defaultChecked={inputs.technologies.includes(technology.id)}
            />
            {technology.name}
          </React.Fragment>
        ))}

        {newTechnologies.map((newTechnology, idx) => (
          <React.Fragment key={idx}>
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) return;
                setNewTechnologies(
                  newTechnologies.filter((nt) => nt.name !== newTechnology.name)
                );
              }}
              checked={true}
            />
            {newTechnology.name}
          </React.Fragment>
        ))}
        <input
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
        />
      </div>
      <div>
        {categories?.map((category) => (
          <React.Fragment key={category.id}>
            <input
              type="checkbox"
              name="categories"
              value={category.id}
              onChange={handleChange}
              defaultChecked={inputs.categories.includes(category.id)}
            />
            {category.title}
          </React.Fragment>
        ))}
      </div>
      <div>
        {screenshots?.map((screenshot) => (
          <React.Fragment key={screenshot.id}>
            <input
              type="checkbox"
              name="screenshots"
              value={screenshot.id}
              onChange={handleChange}
              defaultChecked={inputs.screenshots.includes(screenshot.id)}
            />
            <img src={screenshot.image} alt="project screenshot" width={200} />
          </React.Fragment>
        ))}
      </div>
      <button>Submit</button>
      <p>
        {isLoading && 'Please wait ...'} {isSuccess && 'Updated successfully!'}
      </p>
    </form>
  );
};

export default EditProject;
