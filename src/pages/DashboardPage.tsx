import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ButtonGroup, Button, ListGroup, Spinner } from 'react-bootstrap';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import api from '../services/api';
import { getUserIdFromToken } from '../utils/auth';

interface SubscriptionResponse {
    id: string;
    userId: string;
    packageId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface PackageResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    courseIds: string[];
}

interface CourseResponse {
    id: string;
    title: string;
    description: string;
    subject: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface LessonResponse {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    order: number;
    transcript?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    courseId: string;
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
    const [packages, setPackages] = useState<PackageResponse[]>([]);
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [lessonsMap, setLessonsMap] = useState<Record<string, LessonResponse[]>>({});
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedLessonId, setSelectedLessonId] = useState<string>('');

    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const subRes = await api.get<SubscriptionResponse[]>(`/subscription/active/${userId}`);
                const subs = subRes.data;
                setSubscriptions(subs);

                const pkgPromises = subs.map(sub => api.get<PackageResponse>(`/package/${sub.packageId}`));
                const pkgResults = await Promise.all(pkgPromises);
                const pkgs = pkgResults.map(res => res.data);
                setPackages(pkgs);

                const courseIds = Array.from(new Set(pkgs.flatMap(p => p.courseIds)));
                const coursePromises = courseIds.map(cid => api.get<CourseResponse>(`/course/${cid}`));
                const courseResults = await Promise.all(coursePromises);
                const crs = courseResults.map(res => res.data);
                setCourses(crs);

                if (crs.length > 0) {
                    setSelectedCourseId(crs[0].id);
                }

                const lessonsMapTemp: Record<string, LessonResponse[]> = {};
                await Promise.all(crs.map(async c => {
                    const lessonsRes = await api.get<LessonResponse[]>(`/lesson/course/${c.id}`);
                    const sortedLessons = lessonsRes.data.sort((a, b) => a.order - b.order);
                    lessonsMapTemp[c.id] = sortedLessons;
                }));
                setLessonsMap(lessonsMapTemp);

                if (crs.length > 0) {
                    const defaultLessons = lessonsMapTemp[crs[0].id];
                    if (defaultLessons && defaultLessons.length > 0) {
                        setSelectedLessonId(defaultLessons[0].id);
                    }
                }
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, navigate]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    const courseLessons = lessonsMap[selectedCourseId] || [];
    const selectedLesson = courseLessons.find(l => l.id === selectedLessonId);

    return (
        <div>
            <DashboardNavbar />
            <Container fluid className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <ButtonGroup>
                            {courses.map(c => (
                                <Button
                                    key={c.id}
                                    variant={c.id === selectedCourseId ? 'primary' : 'outline-primary'}
                                    onClick={() => {
                                        setSelectedCourseId(c.id);
                                        const firstLesson = lessonsMap[c.id]?.[0];
                                        if (firstLesson) {
                                            setSelectedLessonId(firstLesson.id);
                                        }
                                    }}
                                >
                                    {c.title}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <ListGroup>
                            {courseLessons.map(l => (
                                <ListGroup.Item
                                    key={l.id}
                                    action
                                    active={l.id === selectedLessonId}
                                    onClick={() => setSelectedLessonId(l.id)}
                                >
                                    {l.title}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        {selectedLesson ? (
                            <>
                                <h2>{selectedLesson.title}</h2>
                                <div className="mb-3">
                                    <video src={selectedLesson.videoUrl} controls className="w-100" />
                                </div>
                                <div>{selectedLesson.transcript}</div>
                            </>
                        ) : (
                            <div>Select a lesson to view</div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DashboardPage; 