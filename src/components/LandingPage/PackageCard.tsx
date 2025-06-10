import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface PackageCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
}

const PackageCard: React.FC<PackageCardProps> = ({ id, title, description, price }) => {
    const navigate = useNavigate();

    const handleSelect = () => {
        navigate('/payment', {
            state: {
                packageId: id,
                packageName: title,
                amount: price
            }
        });
    };

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <Card.Text>Price: {price} AZN</Card.Text>
                <Button 
                    variant="primary" 
                    onClick={handleSelect}
                    className="w-100"
                >
                    Buy Now
                </Button>
            </Card.Body>
        </Card>
    );
};

export default PackageCard;