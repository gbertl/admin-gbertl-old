import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useMutation } from 'react-query';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import * as api from '../../api';
import routes from '../../routes';
import { UserLogin } from '../../typings';
import './style.scss';

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

interface Props {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ setIsLoggedIn }: Props) => {
  const [inputs, setInputs] = useState<IInputs>(initialInputs);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation() as LocationProps;

  const {
    mutate: login,
    isError,
    error,
  } = useMutation<AxiosResponse, AxiosError, UserLogin>(api.login, {
    onSuccess: () => {
      setIsLoggedIn(true);
      setIsLoading(false);
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      } else {
        navigate(routes.home, { replace: true });
      }
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    e.preventDefault();

    if (inputs.username && inputs.password) {
      login({ username: inputs.username, password: inputs.password });
    } else {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="login">
      <Container>
        {location.state?.from && (
          <Alert variant="warning">You must login first.</Alert>
        )}
        <Card className="mx-auto login__card">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="username"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={inputs.username}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="password"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={inputs.password}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isLoading}
              >
                Submit
              </Button>
              {isError && (
                <small className="d-block mt-1 text-center text-danger">
                  {error.message}
                </small>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
};

export default Login;
