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
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);

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

    // Filter unique packages by id
    const uniquePackages = packages.filter((pkg, idx, arr) => arr.findIndex(p => p.id === pkg.id) === idx);

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
        <Container className="mt-5">
            <div style={{ marginBottom: 32, fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                    style={{ color: !selectedPackageId ? '#c33764' : '#222', cursor: !selectedPackageId ? 'default' : 'pointer', fontWeight: !selectedPackageId ? 700 : 500 }}
                    onClick={() => { setSelectedPackageId(null); setSelectedCourse(null); setSelectedLesson(null); }}
                >Paketlər</span>
                {selectedPackageId && <>
                    <span style={{ color: '#888' }}>{'>'}</span>
                    <span
                        style={{ color: selectedPackageId && !selectedCourse ? '#c33764' : '#222', cursor: selectedPackageId && !selectedCourse ? 'default' : 'pointer', fontWeight: selectedPackageId && !selectedCourse ? 700 : 500 }}
                        onClick={() => { setSelectedCourse(null); setSelectedLesson(null); }}
                    >{uniquePackages.find(pkg => pkg.id === selectedPackageId)?.title || 'Kurslar'}</span>
                </>}
                {selectedCourse && <>
                    <span style={{ color: '#888' }}>{'>'}</span>
                    <span
                        style={{ color: selectedCourse && !selectedLesson ? '#c33764' : '#222', cursor: selectedCourse && !selectedLesson ? 'default' : 'pointer', fontWeight: selectedCourse && !selectedLesson ? 700 : 500 }}
                        onClick={() => { setSelectedLesson(null); }}
                    >{selectedCourse.title}</span>
                </>}
                {selectedLesson && <>
                    <span style={{ color: '#888' }}>{'>'}</span>
                    <span style={{ color: '#c33764', fontWeight: 700 }}>{selectedLesson.title}</span>
                </>}
            </div>
            {/* Step 1: Packages */}
            {!selectedPackageId && (
                <div>
                    <h2>Paketlər</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {uniquePackages.map(pkg => (
                            <li
                                key={pkg.id}
                                style={{ cursor: 'pointer', padding: '12px 0', fontWeight: 600, color: '#c33764' }}
                                onClick={() => { setSelectedPackageId(pkg.id); setSelectedCourse(null); setSelectedLesson(null); }}
                            >
                                {pkg.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Step 2: Courses */}
            {selectedPackageId && !selectedCourse && (
                <div>
                    <h2>Kurslar</h2>
                    <Button variant="link" onClick={() => setSelectedPackageId(null)} style={{ color: '#c33764', fontWeight: 500, marginBottom: 12 }}>← Geri</Button>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {uniquePackages.find(pkg => pkg.id === selectedPackageId)?.courseIds.map(courseId => {
                            const course = courses.find(c => c.id === courseId);
                            if (!course) return null;
                            return (
                                <li
                                    key={courseId}
                                    style={{ cursor: 'pointer', padding: '12px 0', fontWeight: 600, color: '#c33764' }}
                                    onClick={() => { setSelectedCourse(course); setSelectedLesson(null); }}
                                >
                                    {course.title}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            {/* Step 3: Lessons */}
            {selectedPackageId && selectedCourse && !selectedLesson && (
                <div>
                    <h2>Dərslər</h2>
                    <Button variant="link" onClick={() => setSelectedCourse(null)} style={{ color: '#c33764', fontWeight: 500, marginBottom: 12 }}>← Geri</Button>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {(lessonsMap[selectedCourse.id] || []).map(lesson => (
                            <li
                                key={lesson.id}
                                style={{ cursor: 'pointer', padding: '12px 0', fontWeight: 600, color: '#c33764' }}
                                onClick={() => setSelectedLesson(lesson)}
                            >
                                {lesson.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Step 4: Lesson Content */}
            {selectedLesson && (
                <Row>
                    <Col md={8}>
                        <h2>{selectedLesson.title}</h2>
                        {selectedLesson.videoUrl ? (
                            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 18, marginBottom: 24, overflow: 'hidden', background: '#000' }}>
                                <video
                                    src={selectedLesson.videoUrl}
                                    controls
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 18,
                                        objectFit: 'cover',
                                        background: '#000'
                                    }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8d7da', borderRadius: 18, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#721c24', fontWeight: 600 }}>
                                Video mövcud deyil
                            </div>
                        )}
                        <Button variant="link" onClick={() => setSelectedLesson(null)} style={{ color: '#c33764', fontWeight: 500 }}>← Geri</Button>
                    </Col>
                    <Col md={4}>
                        <div className="dashboard-card" style={{ minHeight: 300 }}>
                            <Chatbot lessonId={selectedLesson.id} />
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default DashboardPage; 