import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import api from '../../services/api';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [group, setGroup] = useState<number>(1);
  const [sector, setSector] = useState<string>('AZ');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sectorMap: { [key: string]: number } = {
    AZ: 0,
    RU: 1,
    EN: 2,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Password', password);
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('PhoneNumber', phoneNumber);
    formData.append('RoleId', '3');
    formData.append('Group', group.toString());
    formData.append('Sector', sectorMap[sector].toString());
    if (profilePicture) {
      formData.append('ProfilePicture', profilePicture);
    }

    try {
      const response = await api.post('/auth/register', formData);
      console.log('Full registration response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Log the exact structure of response.data
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data));
      
      // Check if we have a user ID in the response data
      if (response.status === 201 || response.status === 200) {
        // Try different possible locations for the user ID
        const userId = response.data?.id || 
                      response.data?.userId || 
                      response.data?.user?.id || 
                      response.data?.data?.id ||
                      (typeof response.data === 'string' ? response.data : null);
        
        console.log('Attempted to extract userId:', {
          fromId: response.data?.id,
          fromUserId: response.data?.userId,
          fromUserObject: response.data?.user?.id,
          fromDataObject: response.data?.data?.id,
          fromString: typeof response.data === 'string' ? response.data : null
        });
        
        if (!userId) {
          console.error('No user ID found in response data. Full response:', response.data);
          throw new Error('Could not find user ID in server response');
        }
        
        console.log('Successfully extracted userId:', userId);
        navigate('/verify-email', { state: { userId: userId.toString() } });
      } else {
        console.error('Unexpected status code:', response.status);
        console.error('Response data:', response.data);
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      setError(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
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
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
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
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="group">
          <Form.Label>Group</Form.Label>
          <Form.Control
            as="select"
            value={group}
            onChange={(e) => setGroup(Number(e.target.value))}
            required
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="sector">
          <Form.Label>Sector</Form.Label>
          <Form.Control
            as="select"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            required
          >
            <option value="AZ">AZ</option>
            <option value="RU">RU</option>
            <option value="EN">EN</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="profilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isLoading}
          className="d-flex align-items-center justify-content-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span>Registering...</span>
            </>
          ) : (
            'Register'
          )}
        </Button>
      </Form>
    </>
  );
};

export default RegisterForm;