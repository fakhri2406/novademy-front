import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPackages } from '../features/packages/packagesSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../utils/auth';
import { useTranslation } from '../i18n/useTranslation';

const PackageSelectionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, status, error } = useSelector((state: RootState) => state.packages);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPackages());
    }
  }, [status, dispatch]);

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

  if (status === 'loading') {
    return <div>{t('loadingPackages')}</div>;
  }

  if (status === 'failed') {
    return <div>{t('error')}: {error}</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">{t('selectPackage')}</h2>
      <Row>
        {packages.map((pkg) => (
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