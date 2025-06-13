import React from 'react';
import { Container } from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plans = [
  {
    name: 'Starter',
    price: '25₼',
    features: ['1 fənn', '100+ video', 'Statistika'],
  },
  {
    name: 'Standard',
    price: '45₼',
    features: ['3 fənn', '300+ video', 'Statistika və testlər'],
  },
  {
    name: 'Premium',
    price: '70₼',
    features: ['Bütün fənlər', '1000+ video', 'Testlər, statistika, müəllim dəstəyi'],
  },
];

const PricingSection: React.FC = () => {
  return (
    <Container className="my-5 text-center">
      
    </Container>
  );
};

export default PricingSection;
