import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  ...(user
    ? [
        { name: 'Attendance', path: '/attendance' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Spin Wheel', path: '/wheel' },
        { name: 'Anti-Proxy', path: '/anti-proxy' },
        { name: 'Contact', path: '/contact' }
      ]
    : [])
];

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="navbar">
      <div className="nav-inner">

        <Link className="logo" to="/" onClick={closeMenu}>
          📘 <span>AttendEase</span>
        </Link>

        <button
          type="button"
          className="nav-toggle-label"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>

          <nav className="nav-links">
            {links.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={closeMenu}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            {user ? (
              <>
                <span>Hi, {user.name}</span>

                <button
                  className="btn btn-outline"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  className="btn btn-primary"
                  to="/signup"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;