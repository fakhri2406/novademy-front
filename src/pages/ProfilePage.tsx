import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/auth';
import api from '../services/api';
import EditProfileForm from '../components/ProfilePage/EditProfileForm';
import { useTranslation } from '../i18n/useTranslation';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<{
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        group: number;
        sector: string;
        profilePictureUrl?: string;
        id: string;
    } | null>(null);

    let fetchUserData: () => Promise<void>;
    fetchUserData = async () => {
        try {
            const response = await api.get('/auth/me');
            const user = response.data;
            setUserData({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                group: user.group,
                sector: user.sector,
                profilePictureUrl: user.profilePictureUrl,
                id: user.id
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const decoded = decodeToken(token);
        if (!decoded) {
            navigate('/login');
            return;
        }

        fetchUserData();
    }, [navigate, fetchUserData]);

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </Spinner>
            </Container>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <div className="text-center mb-4">
                                {userData.profilePictureUrl ? (
                                    <img
                                        src={userData.profilePictureUrl}
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
                                            {userData.firstName[0]}{userData.lastName[0]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <EditProfileForm
                                    initialData={userData}
                                    userId={userData.id}
                                    onSuccess={() => {
                                        setIsEditing(false);
                                        fetchUserData();
                                    }}
                                />
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <h3 className="text-center mb-4">{t('profileInformation')}</h3>
                                        <Row>
                                            <Col md={6}>
                                                <p><strong>{t('username')}:</strong> {userData.username}</p>
                                                <p><strong>{t('firstName')}:</strong> {userData.firstName}</p>
                                                <p><strong>{t('lastName')}:</strong> {userData.lastName}</p>
                                            </Col>
                                            <Col md={6}>
                                                <p><strong>{t('email')}:</strong> {userData.email}</p>
                                                <p><strong>{t('phoneNumber')}:</strong> {userData.phoneNumber}</p>
                                                <p><strong>{t('group')}:</strong> {userData.group}</p>
                                                <p><strong>{t('sector')}:</strong> {userData.sector}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="text-center">
                                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                                            {t('editProfile')}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage; 