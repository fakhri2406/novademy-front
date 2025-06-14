import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @ts-ignore
import { Card, Button, Typography, Spin, message, Alert, Modal } from 'antd';
// @ts-ignore
import { CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getUserIdFromToken } from '../utils/auth';
import api from '../services/api';

const { Title, Text } = Typography;

interface PaymentDetails {
  packageId: string;
  amount: number;
  packageName: string;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    console.log('Payment page location state:', location.state);
    
    // Get payment details from location state
    const details = location.state as PaymentDetails;
    if (!details) {
      console.error('No payment details found in location state');
      setError('Ödəniş məlumatları tapılmadı. Zəhmət olmasa əvvəlcə paket seçin.');
      return;
    }

    // Validate payment details
    if (!details.packageId || !details.amount || !details.packageName) {
      console.error('Invalid payment details:', details);
      setError('Yanlış ödəniş məlumatları. Zəhmət olmasa paketi yenidən seçin.');
      return;
    }

    console.log('Setting payment details:', details);
    setPaymentDetails(details);
  }, [location.state]);

  const handlePayment = async () => {
    if (!paymentDetails) {
      setError('Ödəniş məlumatları yoxdur. Zəhmət olmasa yenidən cəhd edin.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      // Create subscription in backend
      const userId = getUserIdFromToken();
      if (!userId) throw new Error('İstifadəçi tapılmadı. Zəhmət olmasa yenidən daxil olun.');
      await api.post('/subscription', {
        packageId: paymentDetails.packageId,
        userId
      });
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Ödəniş emal edilə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
      message.error('Ödəniş emal edilə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to dashboard after successful payment
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
        <Alert
          message="Ödəniş Xətası"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/packages')}>
              Paketlərə Qayıt
            </Button>
          }
        />
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Ödəniş məlumatları yüklənir...</Text>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
        <Card>
          <Title level={2}>Ödəniş Məlumatları</Title>
          <div style={{ marginBottom: 24 }}>
            <Text strong>Paket:</Text> {paymentDetails.packageName}
          </div>
          <div style={{ marginBottom: 24 }}>
            <Text strong>Məbləğ:</Text> {paymentDetails.amount} AZN
          </div>
          <div style={{ marginBottom: 24 }}>
            <Text type="secondary">Bu demo ödənişdir. Heç bir real ödəniş emal edilməyəcək.</Text>
          </div>
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            size="large"
            block
            loading={loading}
            onClick={handlePayment}
          >
            {loading ? 'Ödəniş Emal Edilir...' : 'Ödənişə Davam Et (Demo)'}
          </Button>
          <Button
            type="link"
            block
            onClick={() => navigate('/packages')}
            style={{ marginTop: 16 }}
          >
            Ləğv Et və Paketlərə Qayıt
          </Button>
        </Card>
      </div>

      <Modal
        title="Ödəniş Uğurlu Oldu"
        open={showSuccessModal}
        onOk={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
        footer={[
          <Button key="dashboard" type="primary" onClick={handleSuccessModalClose}>
            İdarəetmə Paneline Get
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
          <Title level={4}>Alış-verişiniz üçün təşəkkür edirik!</Title>
          <Text>
            {paymentDetails.packageName} üçün {paymentDetails.amount} AZN məbləğində ödənişiniz uğurla emal edildi.
          </Text>
          <br />
          <Text type="secondary">
            (Qeyd: Bu demo ödənişdir. Heç bir real ödəniş emal edilmədi.)
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default Payment; 