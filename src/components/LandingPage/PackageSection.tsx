import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import PackageCard from './PackageCard';
import { fetchPackages } from '../../features/packages/packagesSlice';
import { RootState, AppDispatch } from '../../store';

const PackageSection: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { packages, status, error } = useSelector((state: RootState) => state.packages);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPackages());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <Container>
            <Row>
                {packages.map((pkg) => (
                    <Col key={pkg.id} md={4}>
                        <PackageCard 
                            id={pkg.id}
                            title={pkg.title} 
                            description={pkg.description} 
                            price={pkg.price} 
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PackageSection;