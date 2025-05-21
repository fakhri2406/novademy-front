import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken, setRefreshToken, getUserIdFromToken } from '../../utils/auth';
import { Form, Button } from 'react-bootstrap';
import api from '../../services/api';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      {error && <div className="text-danger mb-2">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;