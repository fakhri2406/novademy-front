import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/auth';
import api from '../services/api';
import EditProfileForm from '../components/ProfilePage/EditProfileForm';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
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

    const fetchUserData = async () => {
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
                    <span className="visually-hidden">Loading...</span>
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
                                        alt="Profile"
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
                                        fetchUserData(); // Fetch fresh data after successful update
                                    }}
                                />
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <h3 className="text-center mb-4">Profile Information</h3>
                                        <Row>
                                            <Col md={6}>
                                                <p><strong>Username:</strong> {userData.username}</p>
                                                <p><strong>First Name:</strong> {userData.firstName}</p>
                                                <p><strong>Last Name:</strong> {userData.lastName}</p>
                                            </Col>
                                            <Col md={6}>
                                                <p><strong>Email:</strong> {userData.email}</p>
                                                <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
                                                <p><strong>Group:</strong> {userData.group}</p>
                                                <p><strong>Sector:</strong> {userData.sector}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="text-center">
                                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                                            Edit Profile
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