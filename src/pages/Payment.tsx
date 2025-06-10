import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Button, Typography, Spin, message, Alert } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PaymentDetails {
  packageId: string;
  amount: number;
  packageName: string;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    console.log('Payment page location state:', location.state);
    
    // Get payment details from location state
    const details = location.state as PaymentDetails;
    if (!details) {
      console.error('No payment details found in location state');
      setError('No payment details found. Please select a package first.');
      return;
    }

    // Validate payment details
    if (!details.packageId || !details.amount || !details.packageName) {
      console.error('Invalid payment details:', details);
      setError('Invalid payment details. Please try selecting the package again.');
      return;
    }

    console.log('Setting payment details:', details);
    setPaymentDetails(details);
  }, [location.state]);

  const handlePayment = async () => {
    if (!paymentDetails) {
      setError('Payment details are missing. Please try again.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Initiating payment for:', paymentDetails);
      
      // Here we'll integrate with the payment gateway
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: paymentDetails.packageId,
          amount: paymentDetails.amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Payment initialization failed');
      }

      const { paymentUrl } = await response.json();
      console.log('Payment URL received:', paymentUrl);
      
      // Redirect to payment gateway
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
      message.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
        <Alert
          message="Payment Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/packages')}>
              Back to Packages
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
          <Text>Loading payment details...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Title level={2}>Payment Details</Title>
        <div style={{ marginBottom: 24 }}>
          <Text strong>Package:</Text> {paymentDetails.packageName}
        </div>
        <div style={{ marginBottom: 24 }}>
          <Text strong>Amount:</Text> {paymentDetails.amount} AZN
        </div>
        <div style={{ marginBottom: 24 }}>
          <Text type="secondary">You will be redirected to our secure payment gateway to complete your purchase.</Text>
        </div>
        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          size="large"
          block
          loading={loading}
          onClick={handlePayment}
        >
          Proceed to Payment
        </Button>
        <Button
          type="link"
          block
          onClick={() => navigate('/packages')}
          style={{ marginTop: 16 }}
        >
          Cancel and Return to Packages
        </Button>
      </Card>
    </div>
  );
};

export default Payment; 