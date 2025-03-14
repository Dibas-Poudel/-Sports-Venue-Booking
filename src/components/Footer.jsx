import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Container */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Left: copyright */}
          <p className="text-center sm:text-left text-sm mb-4 sm:mb-0">
            &copy; 2025 DibasSports. All rights reserved.
          </p>

          {/* Right: Social Media Links */}
          <div className="flex justify-center sm:justify-end space-x-6 text-xl">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
              <FaFacebook />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
