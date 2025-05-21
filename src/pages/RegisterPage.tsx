import React from 'react';
import RegisterNavbar from '../components/RegisterPage/RegisterNavbar';
import RegisterForm from '../components/RegisterPage/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div>
      <RegisterNavbar />
      <div className="container">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;