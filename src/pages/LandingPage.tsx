import React from 'react';
import Hero from '../components/LandingPage/Hero';
import PromoSection from '../components/LandingPage/PromoSection';
import Footer from '../components/LandingPage/Footer';

const LandingPage: React.FC = () => {
    return (
        <div>
            <Hero />
            <PromoSection />
            <Footer />
        </div>
    );
};

export default LandingPage;