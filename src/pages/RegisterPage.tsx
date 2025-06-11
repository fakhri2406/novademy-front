import React from 'react';
import RegisterForm from '../components/RegisterPage/RegisterForm';
import '../styles/LoginPage.css';

const RegisterPage: React.FC = () => {
  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Qeydiyyat</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;