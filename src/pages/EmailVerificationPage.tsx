import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

const EmailVerificationPage: React.FC = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [userId, setUserId] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      setMessage({ text: t('noUserIdProvided'), type: 'danger' });
      setTimeout(() => navigate('/register'), 3000);
    }
  }, [location.state, navigate, t]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input if current input is filled
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name="code-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      const prevInput = document.querySelector(`input[name="code-${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 4) {
      setMessage({ text: t('enterFullCode'), type: 'danger' });
      return;
    }

    // Ensure userId is a valid GUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      setMessage({ text: t('invalidUserIdFormat'), type: 'danger' });
      setTimeout(() => navigate('/register'), 3000);
      return;
    }

    // Ensure code is exactly 4 digits
    const cleanCode = verificationCode.replace(/\D/g, '');
    if (!/^\d{4}$/.test(cleanCode)) {
      setMessage({ text: t('invalidCodeFormat'), type: 'danger' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await api.post('/auth/verify-email', {
        userId: userId.toLowerCase(),
        code: cleanCode
      });

      if (response.status === 200) {
        setMessage({ text: t('emailVerifiedSuccess'), type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      if (error.response?.data) {
        // Handle specific error messages from the API
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || JSON.stringify(error.response.data);

        if (errorMessage.includes('Invalid verification code')) {
          setMessage({ text: t('invalidVerificationCode'), type: 'danger' });
        } else if (errorMessage.includes('expired')) {
          setMessage({ text: t('codeExpired'), type: 'danger' });
        } else if (errorMessage.includes('already verified')) {
          setMessage({ text: t('emailAlreadyVerified'), type: 'info' });
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setMessage({ text: errorMessage, type: 'danger' });
        }
      } else {
        setMessage({ text: t('verificationFailed'), type: 'danger' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{t('emailVerification')}</h2>
              {message && (
                <Alert variant={message.type} className="mb-4">
                  {message.text}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-center d-block mb-3">
                    {t('enterVerificationCode')}
                  </Form.Label>
                  <div className="d-flex justify-content-center gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <Form.Control
                        key={index}
                        type="text"
                        name={`code-${index}`}
                        maxLength={1}
                        value={code[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        style={{ width: '60px', height: '60px', fontSize: '1.5rem', textAlign: 'center' }}
                        disabled={isLoading}
                        required
                      />
                    ))}
                  </div>
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 d-flex align-items-center justify-content-center gap-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span>{t('verifying')}</span>
                    </>
                  ) : (
                    t('verifyEmail')
                  )}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EmailVerificationPage; 