import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import { getAccessToken, decodeToken } from '../utils/auth';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const token = getAccessToken();
    const decoded = token ? decodeToken(token) : null;
    const username = decoded?.sub;
    const firstName = decoded?.firstName;
    const lastName = decoded?.lastName;
    const email = decoded?.email;
    const phoneNumber = decoded?.phoneNumber;
    const group = decoded?.group;
    const sectorCode = decoded?.sector;
    const profilePictureUrl = decoded?.profilePictureUrl;

    // Map sector code to enum name
    const sectorMap: Record<string, string> = { "0": "AZ", "1": "RU", "2": "EN" };
    const sector = sectorCode ? sectorMap[sectorCode] || sectorCode : '';

    return (
        <>
            <DashboardNavbar />
            <Container className="d-flex justify-content-center mt-5">
                <Card style={{ width: '24rem' }}>
                    <Card.Body>
                        <Card.Title>Profile</Card.Title>
                        {profilePictureUrl && (
                            <div className="text-center mb-3">
                                <img
                                    src={profilePictureUrl}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <Card.Text><strong>Username:</strong> {username}</Card.Text>
                        <Card.Text><strong>Name:</strong> {firstName} {lastName}</Card.Text>
                        <Card.Text><strong>Email:</strong> {email}</Card.Text>
                        <Card.Text><strong>Phone Number:</strong> {phoneNumber}</Card.Text>
                        <Card.Text><strong>Group:</strong> {group}</Card.Text>
                        <Card.Text><strong>Sector:</strong> {sector}</Card.Text>
                        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Go back</Button>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ProfilePage; 