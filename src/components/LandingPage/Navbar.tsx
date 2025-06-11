import React from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getAccessToken, clearTokens } from '../../utils/auth';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        navigate('/login');
    };

    return (
        <BSNavbar bg="light" expand="lg" className="shadow-sm">
            <BSNavbar.Brand as={Link} to="/" className="fw-bold">Novademy</BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BSNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav>
                    {isAuthenticated ? (
                        <>
                            <Nav.Link as={Link} to="/packages">Paket Al</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profil</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Çıxış</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/register">Qeydiyyat</Nav.Link>
                            <Nav.Link as={Link} to="/login">Giriş</Nav.Link>
                        </>
                    )}
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
};

export default Navbar;