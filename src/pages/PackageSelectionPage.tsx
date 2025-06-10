import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPackages } from '../features/packages/packagesSlice';
import { RootState, AppDispatch } from '../store';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../utils/auth';

const PackageSelectionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, status, error } = useSelector((state: RootState) => state.packages);
  const navigate = useNavigate();
  const [subscribing, setSubscribing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPackages());
    }
  }, [status, dispatch]);

  const userId = getUserIdFromToken();

  const handleSubscribe = async (packageId: string) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    setSubscribing((prev) => ({ ...prev, [packageId]: true }));
    try {
      await api.post('/subscription', { userId, packageId });
      navigate('/dashboard');
    } catch (err) {
      console.error('Subscription failed:', err);
    } finally {
      setSubscribing((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  if (status === 'loading') {
    return <div>Loading packages...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Select a Package</h2>
      <Row>
        {packages.map((pkg) => (
          <Col key={pkg.id} md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{pkg.title}</Card.Title>
                <Card.Text>{pkg.description}</Card.Text>
                <Card.Text>Price: ${pkg.price}</Card.Text>
                <Button
                  variant="primary"
                  disabled={subscribing[pkg.id]}
                  onClick={() => handleSubscribe(pkg.id)}
                  className="mt-2"
                >
                  {subscribing[pkg.id] ? 'Subscribing...' : 'Select'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PackageSelectionPage; 