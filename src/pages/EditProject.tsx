import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Category, Project, Screenshot, Technology } from '../typings';
import * as api from '../api';

const initialProject = {
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

  const [project, setProject] = useState<Project>(initialProject);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);

  const [newTechnologies, setNewTechnologies] = useState<
    Omit<Technology, 'id'>[] | []
  >([]);

  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!params.id) return;

    e.preventDefault();

    setMessage('loading');

    let newProject = { ...project };
    let createdTechnologies: Technology[] = [];

    if (newTechnologies.length) {
      // create new technologies then add it to project
      const createTechs = async () => {
        let ids: number[] = [];

        for (const nt of newTechnologies) {
          const { data } = await api.createTechnology(nt);
          ids.push(data.id);
          createdTechnologies.push(data);
        }

        return Promise.resolve(ids);
      };

      const newTechIds = await createTechs();
      newProject.technologies = newProject.technologies.concat(newTechIds);
    }

    const { data } = await api.updateProject(parseInt(params.id), newProject);

    setProject(data);

    // replace newTechnologies to newly created technologies
    setTechnologies(technologies.concat(createdTechnologies));
    setNewTechnologies([]);

    setMessage('success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const name = target.name as keyof Project;
    let value: any;

    if (target.type === 'checkbox') {
      const currentArr = project[name];
      const currentValue = parseInt(target.value);

      if (!Array.isArray(currentArr)) return;

      value = target.checked
        ? currentArr.concat(currentValue)
        : currentArr.filter((arrValue) => arrValue !== currentValue);
    } else {
      value = target.value;
    }

    setProject({
      ...project,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (!params.id) return;

      const [
        { data: projectData },
        { data: technologyData },
        { data: categoryData },
        { data: screenshotData },
      ] = await Promise.all([
        api.getProject(parseInt(params.id)),
        api.getTechnologies(),
        api.getCategories(),
        api.getScreenshots(),
      ]);

      setProject(projectData);
      setTechnologies(technologyData);
      setCategories(categoryData);
      setScreenshots(screenshotData);
    };

    fetchAll();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="title"
          value={project.title}
          onChange={handleChange}
          placeholder="title"
        />
      </div>
      <div>
        <input
          type="text"
          name="description"
          value={project.description}
          onChange={handleChange}
          placeholder="description"
        />
      </div>
      <div>
        <input
          type="text"
          name="live_preview"
          value={project.live_preview}
          onChange={handleChange}
          placeholder="live_preview"
        />
      </div>
      <div>
        <input
          type="text"
          name="source_code"
          value={project.source_code}
          onChange={handleChange}
          placeholder="source_code"
        />
      </div>
      <div>
        <input
          type="number"
          name="priority_order"
          value={project.priority_order}
          onChange={handleChange}
          placeholder="priority_order"
        />
      </div>
      <div>
        {technologies.map((technology) => (
          <React.Fragment key={technology.id}>
            <input
              type="checkbox"
              name="technologies"
              value={technology.id}
              onChange={handleChange}
              defaultChecked={project.technologies.includes(technology.id)}
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
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <input
              type="checkbox"
              name="categories"
              value={category.id}
              onChange={handleChange}
              defaultChecked={project.categories.includes(category.id)}
            />
            {category.title}
          </React.Fragment>
        ))}
      </div>
      <div>
        {screenshots.map((screenshot) => (
          <React.Fragment key={screenshot.id}>
            <input
              type="checkbox"
              name="screenshots"
              value={screenshot.id}
              onChange={handleChange}
              defaultChecked={project.screenshots.includes(screenshot.id)}
            />
            <img src={screenshot.image} alt="project screenshot" width={200} />
          </React.Fragment>
        ))}
      </div>
      <button>Submit</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default EditProject;
