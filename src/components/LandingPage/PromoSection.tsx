import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from '../../i18n/useTranslation';

const PromoSection: React.FC = () => {
  const { t } = useTranslation();

  const promos = [
    {
      title: t('videoLessons'),
      desc: t('videoLessonsDesc'),
    },
    {
      title: t('tests'),
      desc: t('testsDesc'),
    },
    {
      title: t('statistics'),
      desc: t('statisticsDesc'),
    },
  ];

  return (
    <Container className="my-5 text-center">
      <h2 className="mb-4">{t('whyNovademy')}</h2>
      <Row>
        {promos.map((item, idx) => (
          <Col md={4} key={idx} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.desc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PromoSection;
