import React from 'react';
import LoginForm from '../components/LoginPage/LoginForm';
import { Container, Card } from 'react-bootstrap';

const LoginPage: React.FC = () => {
  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Login</h2>
              <LoginForm />
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;