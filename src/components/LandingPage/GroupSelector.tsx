import React, { useState } from 'react';
import { Button, Container, ButtonGroup, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from '../../i18n/useTranslation';

const GROUP_KEYS = {
  GRADUATION: 'graduation',
  GROUP1: 'group1',
  GROUP2: 'group2',
  GROUP3: 'group3',
  GROUP4: 'group4',
  GROUP5: 'group5'
} as const;

const GroupSelector: React.FC = () => {
  const { t } = useTranslation();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = [
    { key: GROUP_KEYS.GRADUATION, label: t('graduation') },
    { key: GROUP_KEYS.GROUP1, label: t('group1') },
    { key: GROUP_KEYS.GROUP2, label: t('group2') },
    { key: GROUP_KEYS.GROUP3, label: t('group3') },
    { key: GROUP_KEYS.GROUP4, label: t('group4') },
    { key: GROUP_KEYS.GROUP5, label: t('group5') }
  ];

  const subjectsByGroup: Record<string, string[]> = {
    [GROUP_KEYS.GRADUATION]: [t('math'), t('englishSubject'), t('azRus')],
    [GROUP_KEYS.GROUP1]: [t('math'), t('englishSubject'), t('azRus'), t('physics'), t('informaticsChemistry')],
    [GROUP_KEYS.GROUP2]: [t('math'), t('englishSubject'), t('azRus'), t('geography'), t('history')],
    [GROUP_KEYS.GROUP3]: [t('math'), t('englishSubject'), t('azRus'), t('history'), t('literature')],
    [GROUP_KEYS.GROUP4]: [t('math'), t('englishSubject'), t('azRus'), t('biology'), t('chemistry')],
    [GROUP_KEYS.GROUP5]: [t('math'), t('englishSubject'), t('azRus')]
  };

  return (
    <Container className="text-center my-4">
      <ButtonGroup>
        {groups.map((group) => (
          <Button 
            key={group.key} 
            variant={selectedGroup === group.key ? "primary" : "outline-primary"}
            onClick={() => setSelectedGroup(group.key)}
          >
            {group.label}
          </Button>
        ))}
      </ButtonGroup>
      {selectedGroup && subjectsByGroup[selectedGroup] && (
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

