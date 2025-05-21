import React from 'react';
import LoginNavbar from '../components/LoginPage/LoginNavbar';
import LoginForm from '../components/LoginPage/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div>
      <LoginNavbar />
      <div className="container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;