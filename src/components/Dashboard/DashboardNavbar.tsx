import React from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DashboardNavbar: React.FC = () => {
    return (
        <BSNavbar bg="light" expand="lg">
            <BSNavbar.Brand as={Link} to="/dashboard">Novademy</BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="dashboard-navbar-nav" />
            <BSNavbar.Collapse id="dashboard-navbar-nav" className="justify-content-end">
                <Nav>
                    <Nav.Link as={Link} to="/packages">Buy Package</Nav.Link>
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
};

export default DashboardNavbar; 