import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalContext';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useGlobalContext();
  const location = useLocation();

  const links = [
    { path: '/', label: 'Головна' },
    { path: '/about', label: 'Про центр' },
    { path: '/team', label: 'Команда' },
    { path: '/events', label: 'Події' },
    { path: '/projects', label: 'Проєкти' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ЦЦГ
        </Link>
        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </nav>
  );
}
