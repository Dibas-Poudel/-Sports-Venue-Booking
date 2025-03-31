import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import { logout, resetLogoutStatus } from '../store/slice/user';

const Header = () => {
  const { profile, role, logoutStatus } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout()); 
  };

  useEffect(() => {
    if (logoutStatus === 'succeeded') {
      dispatch(resetLogoutStatus()); // Reset the logout status
      navigate('/'); // Redirect to home after logout
    }
  }, [logoutStatus, dispatch, navigate]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('#mobile-menu')) {  
        setMenuOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Common nav items for both logged in and logged out states
  const commonNavItems = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/contact', label: 'Contact' },
  ];

  // Auth-specific nav items
  const authNavItems = profile
    ? [
        ...(role === 'admin' 
          ? [{ path: '/admin', label: 'Admin Panel' }]
          : [{ path: '/dashboard', label: 'Dashboard' }]
        ),
        { action: handleLogout, label: 'Logout' }
      ]
    : [
        { path: '/register', label: 'Register' },
        { path: '/login', label: 'Login' }
      ];

  // Render a navigation item (either link or button)
  const renderNavItem = (item, index) => {
    if (item.action) {
      return (
        <li key={index}>
          <button
            onClick={item.action}
            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            disabled={logoutStatus === 'loading'}
          >
            {logoutStatus === 'loading' ? 'Logging out...' : item.label}
          </button>
        </li>
      );
    }
    return (
      <li key={index}>
        <Link
          to={item.path}
          className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  // Hamburger menu button component
  const HamburgerButton = () => (
    <button
      onClick={handleMenuToggle}
      type="button"
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="mobile-menu"
      aria-expanded={menuOpen}
    >
      <span className="sr-only">Open main menu</span>
      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
      </svg>
    </button>
  );

  // Mobile menu component
  const MobileMenu = () => (
    <>
      {/* Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {/* Menu */}
      <div
        className={`${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden fixed left-0 top-0 w-3/4 bg-white dark:bg-gray-800 z-50 h-full p-4 transition-transform duration-500 ease-in-out`}
        id="mobile-menu"
      >
        <ul className="font-medium flex flex-col space-y-6">
          {[...commonNavItems, ...authNavItems].map(renderNavItem)}
        </ul>
      </div>
    </>
  );

  // Desktop menu component
  const DesktopMenu = () => (
    <div className="hidden md:flex w-auto space-x-8 rtl:space-x-reverse">
      <ul className="font-medium flex space-x-8 rtl:space-x-reverse">
        {[...commonNavItems, ...authNavItems].map(renderNavItem)}
      </ul>
    </div>
  );

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DibasSports</span>
        </Link>

        <HamburgerButton />
        <DesktopMenu />
        <MobileMenu />
      </div>
    </nav>
  );
};

export default Header;