
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Left: Copyright */}
        <p className="text-sm">&copy; 2025 DibasSports. All rights reserved.</p>

        {/* Right: Navigation Links */}
        <nav className="space-x-6 text-sm">
          <a href="/" className="hover:text-gray-400">Home</a>
          <a href="/games" className="hover:text-gray-400">Games</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
          <a href="/register" className="hover:text-gray-400">Register</a>
          <a href="/login" className="hover:text-gray-400">Login</a>
          
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
