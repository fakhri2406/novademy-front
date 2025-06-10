import React from 'react';
import RegisterForm from '../components/RegisterPage/RegisterForm';
import { Container, Card } from 'react-bootstrap';

const RegisterPage: React.FC = () => {
  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Register</h2>
              <RegisterForm />
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default RegisterPage;