import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from '../../i18n/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark text-white text-center py-4">
      <Container>
        <p>{t('copyright')}</p>
      </Container>
    </footer>
  );
};

export default Footer;
