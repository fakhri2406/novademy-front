import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const promos = [
  {
    title: 'Video Dərslər',
    desc: 'Hər fənn üzrə yüzlərlə izahlı video',
  },
  {
    title: 'Testlər',
    desc: 'Dərslərə uyğun sınaq testləri',
  },
  {
    title: 'Statistika',
    desc: 'Nəticələrini real vaxtda izləmə imkanı',
  },
];

const PromoSection: React.FC = () => {
  return (
    <Container className="my-5 text-center">
      <h2 className="mb-4">Niyə Novademy?</h2>
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
