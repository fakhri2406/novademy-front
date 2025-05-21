import React from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <BSNavbar bg="light" expand="lg">
            <BSNavbar.Brand as={Link} to="/">Novademy</BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BSNavbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
};

export default Navbar;