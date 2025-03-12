import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Import useState, useEffect for fetching profile
import { logout } from '../store/slice/user';
import fetchUserProfile from '../features/fetchUserProfile'; // Import the function to fetch user profile
import supabase from '../services/supabaseClient';

const Header = () => {
  const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open or closed
  const [role, setRole] = useState(null); // State to store user role
  const [loading, setLoading] = useState(true); // Loading state while fetching profile

  // Fetch user role based on authenticated user
  useEffect(() => {
    const fetchRole = async () => {
      if (user && user.id) {
        try {
          const userProfile = await fetchUserProfile(user.id); // Fetch role based on user ID
          setRole(userProfile.role);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false); // Set loading to false after the data is fetched
        }
      } else {
        setLoading(false); // No need to fetch role if user is not logged in
      }
    };

    if (user) {
      fetchRole();
    } else {
      setLoading(false); // If no user is logged in, stop loading
    }
  }, [user]);
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout failed:', error.message);
      } else {
        console.log('Logout successful');
        dispatch(logout()); 
      }
    } catch (error) {
      console.error('An error occurred during logout:', error.message);
    }
  };
  

  // Toggle function for the hamburger menu
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // If the user is not logged in, show login/register options
  if (!user) {
    return (
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DibasSports</span>
          </Link>

          {/* Hamburger button for mobile view */}
          <button
            onClick={handleMenuToggle}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={menuOpen ? 'true' : 'false'}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>

          {/* Desktop navbar (this is always visible on large screens) */}
          <div className="hidden md:flex w-auto space-x-8 rtl:space-x-reverse">
            <ul className="font-medium flex space-x-8 rtl:space-x-reverse">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:hidden fixed left-0 top-0 w-3/4 bg-white dark:bg-gray-800 z-50 h-full p-4 transition-transform duration-500 ease-in-out`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col space-y-6">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // If user is logged in, show the appropriate links based on role
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DibasSports</span>
        </Link>

        {/* Hamburger button for mobile view */}
        <button
          onClick={handleMenuToggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={menuOpen ? 'true' : 'false'}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        {/* Desktop navbar (this is always visible on large screens) */}
        <div className="hidden md:flex w-auto space-x-8 rtl:space-x-reverse">
          <ul className="font-medium flex space-x-8 rtl:space-x-reverse">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/games"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Games
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Contact
              </Link>
            </li>
            {role === 'admin' ? (
              <li>
                <Link
                  to="/admin"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Admin Panel
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/dashboard"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <button
              onClick={handleLogout}
              className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </ul>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden fixed left-0 top-0 w-3/4 bg-white dark:bg-gray-800 z-50 h-full p-4 transition-transform duration-500 ease-in-out`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col space-y-6">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/games"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Games
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Contact
              </Link>
            </li>
            {role === 'admin' ? (
              <li>
                <Link
                  to="/admin"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Admin Panel
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/dashboard"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <button
              onClick={handleLogout}
              className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
