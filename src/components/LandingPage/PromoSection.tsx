import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PromoCard from './PromoCard';

const promoData = [
    { title: 'High-Quality Content', description: 'Learn from the best instructors.' },
    { title: 'Flexible Learning', description: 'Study at your own pace.' },
    { title: 'Affordable Pricing', description: 'Get access to premium content at low cost.' },
];

const PromoSection: React.FC = () => {
    return (
        <Container>
            <Row>
                {promoData.map((item, index) => (
                    <Col key={index} md={4}>
                        <PromoCard title={item.title} description={item.description} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PromoSection;