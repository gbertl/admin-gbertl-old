import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

import routes from '../routes';

interface Props {
  children: React.ReactNode;
}

const index = ({ children }: Props) => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Link to={routes.home} className="navbar-brand">
            Admin Panel
          </Link>
        </Container>
      </Navbar>
      {children}
    </>
  );
};

export default index;
