import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { logout, resetLogoutStatus } from '../store/slice/user';

const Header = () => {
  const { profile, role, logoutStatus } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = () => dispatch(logout());

  // Close menu when logout succeeds
  useEffect(() => {
    if (logoutStatus === 'succeeded') {
      dispatch(resetLogoutStatus());
      navigate('/');
      setMenuOpen(false);
    }
  }, [logoutStatus, dispatch, navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuOpen && !e.target.closest('#mobile-menu')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [menuOpen]);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/contact', label: 'Contact' },
    ...(profile
      ? [
          ...(role === 'admin' 
            ? [{ path: '/admin', label: 'Admin Panel' }] 
            : [{ path: '/dashboard', label: 'Dashboard' }]
          ),
          { action: handleLogout, label: logoutStatus === 'loading' ? 'Logging out...' : 'Logout' }
        ]
      : [
          { path: '/register', label: 'Register' },
          { path: '/login', label: 'Login' }
        ]
  )];

  return (
    <nav className="bg-white dark:bg-gray-900 border-gray-200">
      <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold dark:text-white">
          DibasSports
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item, i) => item.action ? (
            <button
              key={i}
              onClick={item.action}
              className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              disabled={logoutStatus === 'loading'}
            >
              {item.label}
            </button>
          ) : (
            <Link
              key={i}
              to={item.path}
              className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <div className="md:hidden fixed left-0 top-0 w-3/4 bg-white dark:bg-gray-800 z-50 h-full p-4">
              <ul className="space-y-4">
                {navItems.map((item, i) => item.action ? (
                  <li key={i}>
                    <button
                      onClick={item.action}
                      className="w-full py-2 px-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      disabled={logoutStatus === 'loading'}
                    >
                      {item.label}
                    </button>
                  </li>
                ) : (
                  <li key={i}>
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;