import React, { useState, ChangeEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getRefreshToken, setAccessToken } from '../../utils/auth';

interface EditProfileFormProps {
    initialData: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        group: number;
        sector: string;
    };
    userId: string;
    onSuccess: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, userId, onSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Username: initialData.username,
        FirstName: initialData.firstName,
        LastName: initialData.lastName,
        Email: initialData.email,
        PhoneNumber: initialData.phoneNumber,
        Group: initialData.group,
        Sector: initialData.sector
    });
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getFieldError = (fieldName: string): string | undefined => {
        return validationErrors[fieldName]?.[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setValidationErrors({});

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value.toString());
            });

            await api.put(`/user/${userId}`, formDataToSend);
            
            // After successful update, refresh the token
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                const tokenResponse = await api.post('/auth/refresh', { token: refreshToken });
                if (tokenResponse.data?.accessToken) {
                    setAccessToken(tokenResponse.data.accessToken);
                }
            }

            onSuccess();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
            } else {
                setError(err.response?.data?.message || 'An error occurred while updating the profile.');
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="Username"
                    value={formData.Username}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('Username')}
                />
                <Form.Control.Feedback type="invalid">
                    {getFieldError('Username')}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('FirstName')}
                />
                <Form.Control.Feedback type="invalid">
                    {getFieldError('FirstName')}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('LastName')}
                />
                <Form.Control.Feedback type="invalid">
                    {getFieldError('LastName')}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('Email')}
                />
                <Form.Control.Feedback type="invalid">
                    {getFieldError('Email')}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="tel"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('PhoneNumber')}
                />
                <Form.Control.Feedback type="invalid">
                    {getFieldError('PhoneNumber')}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Group</Form.Label>
                <Form.Select
                    name="Group"
                    value={formData.Group}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('Group')}
                >
                    <option value={1}>Group 1</option>
                    <option value={2}>Group 2</option>
                    <option value={3}>Group 3</option>
                    <option value={4}>Group 4</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {getFieldError('Group')}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Sector</Form.Label>
                <Form.Select
                    name="Sector"
                    value={formData.Sector}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('Sector')}
                >
                    <option value="Azerbaijani">Azerbaijani</option>
                    <option value="Russian">Russian</option>
                    <option value="English">English</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {getFieldError('Sector')}
                </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
                Save Changes
            </Button>
        </Form>
    );
};

export default EditProfileForm; 