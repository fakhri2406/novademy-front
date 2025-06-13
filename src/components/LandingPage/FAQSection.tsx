import React from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { useTranslation } from '../../i18n/useTranslation';

const FAQSection: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faq1q'),
      answer: t('faq1a'),
    },
    {
      question: t('faq2q'),
      answer: t('faq2a'),
    },
    {
      question: t('faq3q'),
      answer: t('faq3a'),
    },
  ];

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">{t('faqTitle')}</h2>
      <Accordion>
        {faqs.map((faq, idx) => (
          <Accordion.Item eventKey={String(idx)} key={idx}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default FAQSection;
