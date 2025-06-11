import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

const courses = [
  { title: 'Riyaziyyat', videos: 120, teacher: 'Rüfət Quliyev' },
  { title: 'Fizika', videos: 120, teacher: 'Rüfət Quliyev' },
  { title: 'İnformatika', videos: 120, teacher: 'Rüfət Quliyev' },
];

const CourseSection: React.FC = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Kurslar</h2>
      <Row>
        {courses.map((course, idx) => (
          <Col key={idx} md={4} className="mb-4">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.videos} video</Card.Text>
                <Card.Text>{course.teacher}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CourseSection;
