import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center">
            <span className="text-xl font-semibold">SubConnect™</span>
            <nav className="flex flex-col md:flex-row md:ml-6 mt-2 md:mt-0 space-y-2 md:space-y-0 md:space-x-6">
              <a href="/about" className="hover:underline">About Us</a>
              <a href="/contact" className="hover:underline">Contact</a>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
            </nav>
          </div>
          <div className="mt-4 md:mt-0">
            <p>Follow us on:</p>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Instagram</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>© {new Date().getFullYear()} SubConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;