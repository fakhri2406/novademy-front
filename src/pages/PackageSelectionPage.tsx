import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPackages } from '../features/packages/packagesSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';
import { getUserIdFromToken } from '../utils/auth';

interface Subscription {
    id: string;
    userId: string;
    packageId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

const PackageSelectionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, status, error } = useSelector((state: RootState) => state.packages);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPackages());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get<Subscription[]>(`/subscription/active/${userId}`);
        setUserSubscriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch user subscriptions:', error);
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };

    fetchUserSubscriptions();
  }, [navigate]);

  const handleSelectPackage = (packageId: string, packageTitle: string, price: number) => {
    setLoading((prev) => ({ ...prev, [packageId]: true }));
    try {
      // Navigate to payment page with package details
      navigate('/payment', {
        state: {
          packageId,
          packageName: packageTitle,
          amount: price
        }
      });
    } catch (err) {
      console.error('Failed to process package selection:', err);
    } finally {
      setLoading((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  if (status === 'loading' || isLoadingSubscriptions) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">{t('loadingPackages')}</p>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {t('error')}: {error}
        </Alert>
      </Container>
    );
  }

  // Filter out packages that the user has already purchased
  const availablePackages = packages.filter(
    pkg => !userSubscriptions.some(sub => sub.packageId === pkg.id)
  );

  if (availablePackages.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>{t('noAvailablePackages')}</Alert.Heading>
          <p>{t('allPackagesPurchased')}</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/dashboard')}
            className="mt-3"
          >
            {t('goToDashboard')}
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">{t('selectPackage')}</h2>
      <Row>
        {availablePackages.map((pkg) => (
          <Col key={pkg.id} md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{pkg.title}</Card.Title>
                <Card.Text>{t('packageDescription')}: {pkg.description}</Card.Text>
                <Card.Text>{t('price')}: {pkg.price} AZN</Card.Text>
                <Button
                  variant="primary"
                  disabled={loading[pkg.id]}
                  onClick={() => handleSelectPackage(pkg.id, pkg.title, pkg.price)}
                  className="mt-2 w-100"
                >
                  {loading[pkg.id] ? t('processing') : t('buyNow')}
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