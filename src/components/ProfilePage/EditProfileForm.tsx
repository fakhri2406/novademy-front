import React, { useState, ChangeEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getRefreshToken, setAccessToken } from '../../utils/auth';
import { useTranslation } from '../../i18n/useTranslation';

interface EditProfileFormProps {
    initialData: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        group: number;
        sector: string;
        profilePictureUrl?: string;
    };
    userId: string;
    onSuccess: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, userId, onSuccess }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Sector mappings
    const sectorMap: { [key: string]: number } = {
        'Azerbaijani': 0,
        'Russian': 1,
        'English': 2
    };

    const reverseSectorMap: { [key: number]: string } = {
        0: 'Azerbaijani',
        1: 'Russian',
        2: 'English'
    };

    // Convert initial sector to string if it's a number
    const initialSector = typeof initialData.sector === 'number' 
        ? reverseSectorMap[initialData.sector] || 'Azerbaijani'
        : initialData.sector;

    const [formData, setFormData] = useState({
        Username: initialData.username,
        FirstName: initialData.firstName,
        LastName: initialData.lastName,
        Email: initialData.email,
        PhoneNumber: initialData.phoneNumber,
        Group: initialData.group,
        Sector: initialSector
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialData.profilePictureUrl);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePicture(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getFieldError = (fieldName: string): string | undefined => {
        return validationErrors[fieldName]?.[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setValidationErrors({});
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            
            // Convert sector to number based on selection
            const sectorNumber = sectorMap[formData.Sector] ?? 0;
            
            // Append all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'Sector') {
                    formDataToSend.append(key, sectorNumber.toString());
                } else {
                    formDataToSend.append(key, value.toString());
                }
            });

            if (profilePicture) {
                formDataToSend.append('ProfilePicture', profilePicture);
            }

            const response = await api.put(`/user/${userId}`, formDataToSend);
            
            // After successful update, refresh the token
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const tokenResponse = await api.post('/auth/refresh', { token: refreshToken });
                    if (tokenResponse.data?.accessToken) {
                        setAccessToken(tokenResponse.data.accessToken);
                    }
                } catch (tokenError) {
                    console.warn('Token refresh failed:', tokenError);
                    // Don't show error to user if token refresh fails, as profile update was successful
                }
            }
            
            onSuccess();
        } catch (err: any) {
            console.error('Profile update error:', err);
            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError(t('profileUpdateError'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className="text-center mb-4">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={t('profile')}
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: '150px', height: '150px' }}
                    >
                        <span className="text-white h1">
                            {formData.FirstName[0]}{formData.LastName[0]}
                        </span>
                    </div>
                )}
                <Form.Group className="mt-3">
                    <Form.Label>{t('profilePicture')}</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Form.Group>
            </div>

            <Form.Group className="mb-3">
                <Form.Label>{t('username')}</Form.Label>
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
                <Form.Label>{t('firstName')}</Form.Label>
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
                <Form.Label>{t('lastName')}</Form.Label>
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
                <Form.Label>{t('email')}</Form.Label>
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
                <Form.Label>{t('phoneNumber')}</Form.Label>
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
                <Form.Label>{t('group')}</Form.Label>
                <Form.Select
                    name="Group"
                    value={formData.Group}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('Group')}
                >
                    <option value={1}>{t('group1')}</option>
                    <option value={2}>{t('group2')}</option>
                    <option value={3}>{t('group3')}</option>
                    <option value={4}>{t('group4')}</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {getFieldError('Group')}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>{t('sector')}</Form.Label>
                <Form.Select
                    name="Sector"
                    value={formData.Sector}
                    onChange={handleChange}
                    isInvalid={!!getFieldError('Sector')}
                >
                    <option value="Azerbaijani">{t('azerbaijani')}</option>
                    <option value="Russian">{t('russian')}</option>
                    <option value="English">{t('english')}</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {getFieldError('Sector')}
                </Form.Control.Feedback>
            </Form.Group>

            <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
                className="w-100"
            >
                {isSubmitting ? t('saving') : t('saveChanges')}
            </Button>
        </Form>
    );
};

export default EditProfileForm; 