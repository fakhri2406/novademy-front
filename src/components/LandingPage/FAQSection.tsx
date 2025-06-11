import React, { useState } from 'react';
import { Accordion, Container } from 'react-bootstrap';

const faqs = [
  {
    question: 'Novademy nədir?',
    answer: 'Novademy şagirdlər üçün onlayn hazırlaşma platformasıdır.',
  },
  {
    question: 'Necə qeydiyyatdan keçə bilərəm?',
    answer: 'Ana səhifədəki qeydiyyat düyməsinə klikləyərək qeydiyyatdan keçə bilərsiniz.',
  },
  {
    question: 'Qiymətlər necədir?',
    answer: 'Qiymətlər hissəsində müxtəlif planlar mövcuddur.',
  },
];

const FAQSection: React.FC = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Suallar və Cavablar</h2>
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
