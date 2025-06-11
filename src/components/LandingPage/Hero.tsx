import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero-section">
      <Carousel interval={3000}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/study1.png"
            alt="Study Image 1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/study2.png"
            alt="Study Image 2"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/study3.png"
            alt="Study Image 3"
          />
        </Carousel.Item>
      </Carousel>
      <div className="hero-overlay">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="text-white">
              <h1 className="display-4 fw-bold mb-4">Qəbul imtahanına son 4 ay</h1>
              <p className="lead mb-4">Bu 4 ayda nəticəni Novademy ilə maksimuma çatdır!</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Hero;