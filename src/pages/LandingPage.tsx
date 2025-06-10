import React from 'react';
import Hero from '../components/LandingPage/Hero';
import PromoSection from '../components/LandingPage/PromoSection';
import PackageSection from '../components/LandingPage/PackageSection';
import Footer from '../components/LandingPage/Footer';

const LandingPage: React.FC = () => {
    return (
        <div>
            <Hero />
            <PromoSection />
            <PackageSection />
            <Footer />
        </div>
    );
};

export default LandingPage;