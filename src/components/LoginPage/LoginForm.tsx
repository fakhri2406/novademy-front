import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setAccessToken, setRefreshToken, getUserIdFromToken } from '../../utils/auth';
import { Form, Button, InputGroup } from 'react-bootstrap';
import api from '../../services/api';
import { useTranslation } from '../../i18n/useTranslation';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Password', password);
    try {
      const response = await api.post('/auth/login', formData);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      const userId = getUserIdFromToken();
      try {
        const subRes = await api.get(`/subscription/active/${userId}`);
        if (subRes.status === 200 && Array.isArray(subRes.data) && subRes.data.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/packages');
        }
      } catch {
        navigate('/packages');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(t('loginFailed'));
    }
  };

  return (
    <>
      {error && <div className="text-danger mb-2">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>{t('username')}</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password" className="mb-4">
          <Form.Label>{t('password')}</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? (
                <i className="bi bi-eye-slash"></i>
              ) : (
                <i className="bi bi-eye"></i>
              )}
            </Button>
          </InputGroup>
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mb-3">
          {t('login')}
        </Button>
        <div className="text-center">
          <small className="text-muted">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-decoration-none">{t('register')}</Link>
          </small>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;