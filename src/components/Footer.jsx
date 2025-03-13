import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Left: copyright */}
        <p className="text-sm">&copy; 2025 DibasSports. All rights reserved.</p>

        {/* Right: Navigation Links */}
        <nav className="space-x-6 text-sm">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/games" className="hover:text-gray-400">Games</Link>
          <Link to="/contact" className="hover:text-gray-400">Contact</Link>
          <Link to="/register" className="hover:text-gray-400">Register</Link>
          <Link to="/login" className="hover:text-gray-400">Login</Link>
          
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
