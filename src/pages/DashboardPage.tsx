import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ButtonGroup, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Chatbot } from '../components/Dashboard/Chatbot';
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
    const [error, setError] = useState<string | null>(null);
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
                setError(null);
                console.log('Fetching subscriptions for user:', userId);
                
                const subRes = await api.get<SubscriptionResponse[]>(`/subscription/active/${userId}`);
                const subs = subRes.data;
                console.log('Active subscriptions:', subs);
                
                if (subs.length === 0) {
                    setError('You don\'t have any active subscriptions. Please purchase a package to access lessons.');
                    setLoading(false);
                    return;
                }
                
                setSubscriptions(subs);

                console.log('Fetching package details...');
                const pkgPromises = subs.map(sub => api.get<PackageResponse>(`/package/${sub.packageId}`));
                const pkgResults = await Promise.all(pkgPromises);
                const pkgs = pkgResults.map(res => res.data);
                console.log('Packages:', pkgs);
                setPackages(pkgs);

                const courseIds = Array.from(new Set(pkgs.flatMap(p => p.courseIds)));
                console.log('Course IDs:', courseIds);
                
                if (courseIds.length === 0) {
                    setError('No courses found in your packages. Please contact support.');
                    setLoading(false);
                    return;
                }

                console.log('Fetching course details...');
                const coursePromises = courseIds.map(cid => api.get<CourseResponse>(`/course/${cid}`));
                const courseResults = await Promise.all(coursePromises);
                const crs = courseResults.map(res => res.data);
                console.log('Courses:', crs);
                setCourses(crs);

                if (crs.length > 0) {
                    setSelectedCourseId(crs[0].id);
                }

                console.log('Fetching lessons...');
                const lessonsMapTemp: Record<string, LessonResponse[]> = {};
                await Promise.all(crs.map(async c => {
                    try {
                        const lessonsRes = await api.get<LessonResponse[]>(`/lesson/course/${c.id}`);
                        const sortedLessons = lessonsRes.data.sort((a, b) => a.order - b.order);
                        lessonsMapTemp[c.id] = sortedLessons;
                        console.log(`Lessons for course ${c.id}:`, sortedLessons);
                    } catch (err) {
                        console.error(`Failed to fetch lessons for course ${c.id}:`, err);
                        lessonsMapTemp[c.id] = [];
                    }
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
                setError('Failed to load your courses and lessons. Please try refreshing the page.');
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
                <p className="mt-2">Loading your courses and lessons...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    <Alert.Heading>Unable to load lessons</Alert.Heading>
                    <p>{error}</p>
                    {error.includes('subscriptions') && (
                        <Button 
                            variant="primary" 
                            onClick={() => navigate('/packages')}
                            className="mt-2"
                        >
                            View Available Packages
                        </Button>
                    )}
                </Alert>
            </Container>
        );
    }

    const courseLessons = lessonsMap[selectedCourseId] || [];
    const selectedLesson = courseLessons.find(l => l.id === selectedLessonId);

    if (courses.length === 0) {
        return (
            <Container className="mt-4">
                <Alert variant="info">
                    <Alert.Heading>No Courses Available</Alert.Heading>
                    <p>There are no courses available in your packages at the moment.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <div>
            <Container fluid className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <h2>Your Courses</h2>
                        <ButtonGroup className="mb-4">
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
                        <h3>Lessons</h3>
                        {courseLessons.length === 0 ? (
                            <Alert variant="info">No lessons available for this course.</Alert>
                        ) : (
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
                        )}
                    </Col>
                    <Col md={6}>
                        {selectedLesson ? (
                            <>
                                <h2>{selectedLesson.title}</h2>
                                <div className="mb-3">
                                    <video 
                                        src={selectedLesson.videoUrl} 
                                        controls 
                                        className="w-100"
                                        poster={selectedLesson.imageUrl}
                                    />
                                </div>
                                <div className="lesson-description">
                                    <h4>Description</h4>
                                    <p>{selectedLesson.description}</p>
                                </div>
                                {selectedLesson.transcript && (
                                    <div className="lesson-transcript mt-4">
                                        <h4>Transcript</h4>
                                        <p>{selectedLesson.transcript}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Alert variant="info">
                                Select a lesson from the list to start learning
                            </Alert>
                        )}
                    </Col>
                    <Col md={3}>
                        {selectedLesson && (
                            <div className="sticky-top" style={{ top: '20px' }}>
                                <Chatbot lessonId={selectedLesson.id} />
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DashboardPage; 