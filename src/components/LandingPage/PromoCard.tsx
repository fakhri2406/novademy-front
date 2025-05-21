import React from 'react';
import { Card } from 'react-bootstrap';

interface PromoCardProps {
    title: string;
    description: string;
}

const PromoCard: React.FC<PromoCardProps> = ({ title, description }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default PromoCard;