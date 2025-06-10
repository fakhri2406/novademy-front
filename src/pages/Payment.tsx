import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Button, Typography, Spin, message, Alert, Modal } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
      message.error('Failed to process payment. Please try again.');
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
    <>
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
            <Text type="secondary">This is a demo payment. No actual payment will be processed.</Text>
          </div>
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            size="large"
            block
            loading={loading}
            onClick={handlePayment}
          >
            {loading ? 'Processing Payment...' : 'Proceed to Payment (Demo)'}
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

      <Modal
        title="Payment Successful"
        open={showSuccessModal}
        onOk={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
        footer={[
          <Button key="dashboard" type="primary" onClick={handleSuccessModalClose}>
            Go to Dashboard
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
          <Title level={4}>Thank you for your purchase!</Title>
          <Text>
            Your payment of {paymentDetails.amount} AZN for {paymentDetails.packageName} has been processed successfully.
          </Text>
          <br />
          <Text type="secondary">
            (Note: This is a demo payment. No actual payment was processed.)
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default Payment; 