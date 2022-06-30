import { useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import * as api from '../api';

interface IInputs {
  username: string;
  password: string;
}

const initialInputs = {
  username: '',
  password: '',
};

interface LocationProps {
  state: {
    from: Location;
  };
}

const Login = () => {
  const [inputs, setInputs] = useState<IInputs>(initialInputs);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation() as LocationProps;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setMessage('loggin you in');

      await api.login(inputs.username, inputs.password);

      setInputs(initialInputs);

      if (location.state?.from) {
        navigate(location.state?.from);
      }

      setMessage('done');
    } catch (e) {
      if (e instanceof Error) {
        setMessage(e.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="username"
        value={inputs.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={inputs.password}
        onChange={handleChange}
      />
      <button>Submit</button>
      {message && <div className="alert alert-info">{message}</div>}
    </form>
  );
};

export default Login;
