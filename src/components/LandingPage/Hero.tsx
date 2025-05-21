import React from 'react';
import { Container } from 'react-bootstrap';

const Hero: React.FC = () => {
    return (
        <div className="bg-light py-5">
            <Container>
                <h1 className="display-4">Welcome to Novademy</h1>
                <p className="lead">Your gateway to quality education in Azerbaijan</p>
            </Container>
        </div>
    );
};

export default Hero;