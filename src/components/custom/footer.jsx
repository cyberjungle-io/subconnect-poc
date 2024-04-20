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
            
            <div className="flex space-x-4 mt-2 hover:text-gray-400">
              
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="fill-white hover:fill-gray-400 "><svg width="25" height="25" viewBox="0 0 1200 1227" fill="white" xmlns="http://www.w3.org/2000/svg">
<path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white"/>
</svg>
</a>
              
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
