import React, { useState } from 'react';
import { Button, Container, ButtonGroup, Row, Col, Card } from 'react-bootstrap';

const groups = ['Buraxılış', '1-ci qrup', '2-ci qrup', '3-cü qrup', '4-cü qrup', '5-ci qrup'];

const subjectsByGroup: Record<string, string[]> = {
  'Buraxılış': ['Riyaziyyat', 'İngiliscə', 'Azərbaycan/Rus'],
  '1-ci qrup': ['Riyaziyyat', 'İngiliscə', 'Azərbaycan/Rus', 'Fizika', 'İnformatika/Kimya'],
  '2-ci qrup': ['Riyaziyyat', 'İngiliscə', 'Azərbaycan/Rus', 'Coğrafiya', 'Tarix'],
  '3-cü qrup': ['Riyaziyyat', 'İngiliscə', 'Azərbaycan/Rus', 'Tarix', 'Ədəbiyyat'],
  '4-cü qrup': ['Riyaziyyat', 'İngiliscə', 'Azərbaycan/Rus', 'Biologiya', 'Kimya'],
  '5-ci qrup': ['Riyaziyyat', 'İngiliscə', 'Azərbaycan/Rus']
};

const GroupSelector: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  return (
    <Container className="text-center my-4">
      <ButtonGroup>
        {groups.map((group, idx) => (
          <Button 
            key={idx} 
            variant={selectedGroup === group ? "primary" : "outline-primary"}
            onClick={() => setSelectedGroup(group)}
          >
            {group}
          </Button>
        ))}
      </ButtonGroup>
      {selectedGroup && (
        <Row className="mt-4">
          {subjectsByGroup[selectedGroup].map((subject, idx) => (
            <Col key={idx} md={4} className="mb-3">
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title>{subject}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GroupSelector;

