import React from 'react';
import LoginForm from '../components/LoginPage/LoginForm';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Giriş</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;