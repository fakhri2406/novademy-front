import React from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getAccessToken, clearTokens } from '../../utils/auth';
import LanguageSelector from '../LanguageSelector';
import { useTranslation } from '../../i18n/useTranslation';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!getAccessToken();
    const { t } = useTranslation();

    const handleLogout = () => {
        clearTokens();
        navigate('/login');
    };

    return (
        <BSNavbar bg="light" expand="lg" className="shadow-sm">
            <BSNavbar.Brand as={Link} to="/" className="fw-bold">Novademy</BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BSNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className="align-items-center">
                    {isAuthenticated ? (
                        <>
                            <Nav.Link as={Link} to="/dashboard">{t('myCourses')}</Nav.Link>
                            <Nav.Link as={Link} to="/packages">{t('packages')}</Nav.Link>
                            <Nav.Link as={Link} to="/profile">{t('profile')}</Nav.Link>
                            <Nav.Link onClick={handleLogout}>{t('logout')}</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/register">{t('register')}</Nav.Link>
                            <Nav.Link as={Link} to="/login">{t('login')}</Nav.Link>
                        </>
                    )}
                    <div className="ms-3">
                        <LanguageSelector />
                    </div>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
};

export default Navbar;