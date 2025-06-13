import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { useTranslation } from '../../i18n/useTranslation';
import './Hero.css';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hero-section">
      <Carousel interval={3000}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/study1.png"
            alt={t('studyImage1')}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/study2.png"
            alt={t('studyImage2')}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/study3.png"
            alt={t('studyImage3')}
          />
        </Carousel.Item>
      </Carousel>
      <div className="hero-overlay">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="text-white">
              <h1 className="display-4 fw-bold mb-4">{t('heroTitle')}</h1>
              <p className="lead mb-4">{t('heroSubtitle')}</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Hero;