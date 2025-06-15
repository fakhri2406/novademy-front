import React from 'react';
import RegisterForm from '../components/RegisterPage/RegisterForm';
import '../styles/LoginPage.css';
import { useTranslation } from '../i18n/useTranslation';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">{t('register')}</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;