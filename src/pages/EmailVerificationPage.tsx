import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const EmailVerificationPage: React.FC = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [userId, setUserId] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      setMessage({ text: 'İstifadəçi ID-si təmin edilməyib. Zəhmət olmasa yenidən qeydiyyatdan keçin.', type: 'danger' });
      setTimeout(() => navigate('/register'), 3000);
    }
  }, [location.state, navigate]);

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
      setMessage({ text: 'Zəhmət olmasa 4 rəqəmli kodu tam daxil edin.', type: 'danger' });
      return;
    }

    // Ensure userId is a valid GUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.error('Invalid userId format in verifyEmail:', userId);
      setMessage({ text: 'Yanlış istifadəçi ID formatı. Zəhmət olmasa yenidən qeydiyyatdan keçin.', type: 'danger' });
      setTimeout(() => navigate('/register'), 3000);
      return;
    }

    // Ensure code is exactly 4 digits
    const cleanCode = verificationCode.replace(/\D/g, '');
    if (!/^\d{4}$/.test(cleanCode)) {
      console.error('Invalid code format in verifyEmail:', verificationCode);
      setMessage({ text: 'Yanlış təsdiq kodu formatı. 4 rəqəm gözlənilir.', type: 'danger' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      console.log('Sending verification request:', {
        userId,
        code: cleanCode,
        endpoint: '/auth/verify-email'
      });

      const response = await api.post('/auth/verify-email', {
        userId: userId.toLowerCase(),
        code: cleanCode
      });

      console.log('Verification response:', response.data);

      if (response.status === 200) {
        setMessage({ text: 'E-poçt uğurla təsdiqləndi! Giriş səhifəsinə yönləndirilirsiniz...', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      console.error('Verification error details:', {
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          userId,
          code: cleanCode
        }
      });

      if (error.response?.data) {
        // Handle specific error messages from the API
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || JSON.stringify(error.response.data);

        if (errorMessage.includes('Invalid verification code')) {
          setMessage({ text: 'Təsdiq kodu yanlışdır. Zəhmət olmasa e-poçtunuzu yoxlayın və yenidən cəhd edin.', type: 'danger' });
        } else if (errorMessage.includes('expired')) {
          setMessage({ text: 'Təsdiq kodu müddəti bitib. Zəhmət olmasa yeni kod tələb edin.', type: 'danger' });
        } else if (errorMessage.includes('already verified')) {
          setMessage({ text: 'Bu e-poçt artıq təsdiqlənib. İndi daxil ola bilərsiniz.', type: 'info' });
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setMessage({ text: errorMessage, type: 'danger' });
        }
      } else {
        setMessage({ text: 'Təsdiq uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.', type: 'danger' });
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
              <h2 className="text-center mb-4">E-poçt Təsdiqi</h2>
              {message && (
                <Alert variant={message.type} className="mb-4">
                  {message.text}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-center d-block mb-3">
                    E-poçtunuza göndərilən 4 rəqəmli kodu daxil edin
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
                      <span>Təsdiqlənir...</span>
                    </>
                  ) : (
                    'E-poçtu Təsdiqlə'
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