import React from 'react';
import Hero from '../components/LandingPage/Hero';
import PromoSection from '../components/LandingPage/PromoSection';
import GroupSelector from '../components/LandingPage/GroupSelector';
import CourseSection from '../components/LandingPage/CourseSection';
import PricingSection from '../components/LandingPage/PricingSection';
import FAQSection from '../components/LandingPage/FAQSection';
import Footer from '../components/LandingPage/Footer';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <PromoSection />
      <GroupSelector />
      <CourseSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </>
  );
};

export default LandingPage;

