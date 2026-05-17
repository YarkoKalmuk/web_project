import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from '../ProfileModal/ProfileModal';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useGlobalContext();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const links = [
    { path: '/', label: 'Головна' },
    { path: '/about', label: 'Про центр' },
    { path: '/team', label: 'Команда' },
    { path: '/events', label: 'Події' },
    { path: '/projects', label: 'Проєкти' },
  ];

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const defaultAvatar = user ? `https://ui-avatars.com/api/?name=${user.username}&background=random` : '';

  return (
    <>
      <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/DH_representing_photos/circle_DH.jpg" alt="Logo" className="navbar-logo-img" />
          ЦЦГ
        </Link>

        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={`navbar-actions ${menuOpen ? 'active' : ''}`}>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="auth-controls">
              {isAdmin && <span className="admin-badge">Адмін</span>}
              <button 
                onClick={() => setProfileModalOpen(true)} 
                className="profile-nav-btn"
                title="Мій профіль"
              >
                <img src={user.avatar_url || defaultAvatar} alt="Profile" />
              </button>
              <button onClick={() => { logout(); closeMenu(); }} className="auth-btn logout-btn">
                Вийти
              </button>
            </div>
          ) : (
            <Link to="/login" className="auth-btn login-btn" onClick={closeMenu}>
              Увійти
            </Link>
          )}
        </div>
      </div>
    </nav>
    <ProfileModal 
      isOpen={profileModalOpen} 
      onClose={() => setProfileModalOpen(false)} 
    />
    </>
  );
}
