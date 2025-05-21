import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface PackageCardProps {
    title: string;
    description: string;
    price: number;
}

const PackageCard: React.FC<PackageCardProps> = ({ title, description, price }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <Card.Text>Price: ${price}</Card.Text>
                <Link to="/register" className="btn btn-primary">Select</Link>
            </Card.Body>
        </Card>
    );
};

export default PackageCard;