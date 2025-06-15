import React from 'react';
import LoginForm from '../components/LoginPage/LoginForm';
import '../styles/LoginPage.css';
import { useTranslation } from '../i18n/useTranslation';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">{t('login')}</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;