import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import routes from '../routes';
import { axiosPrivate } from '../axios';

interface Props {
  children: React.ReactNode;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout = ({ children, isLoggedIn, setIsLoggedIn }: Props) => {
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Link to={routes.home} className="navbar-brand">
            Admin Panel
          </Link>
          <Nav>
            {isLoggedIn ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  axiosPrivate.defaults.headers.common['Authorization'] = '';
                  setIsLoggedIn(false);
                }}
                className="nav-link"
              >
                Logout
              </button>
            ) : (
              <Link to={routes.login} className="nav-link">
                Login
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      {children}
    </>
  );
};

export default Layout;
