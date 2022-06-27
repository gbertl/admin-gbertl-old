import { useEffect, useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { Project } from '../typings';
import axios from '../axios';
import routes from '../routes';

const EditProject = () => {
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

  return <div>{JSON.stringify(project)}</div>;
};

export default EditProject;
