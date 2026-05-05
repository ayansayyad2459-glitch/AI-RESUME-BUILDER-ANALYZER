import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <Sparkles size={24} />
        <span>ResumeAI</span>
      </Link>

      <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/analyze" className={isActive('/analyze')}>Analyze</Link>
            <Link to="/builder" className={isActive('/builder')}>Builder</Link>
            <Link to="/jobs" className={isActive('/jobs')}>Jobs</Link>
            <button onClick={logout} className="btn btn-sm btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className="btn btn-sm btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
