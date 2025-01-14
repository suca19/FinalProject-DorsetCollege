import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <div className="container mx-auto">
        <p>&copy; 2024 E-Commerce App. All rights reserved.</p>
        <div className="mt-2">
          <a href="#" className="text-blue-400 hover:text-blue-300 mx-2">Privacy Policy</a>
          <a href="#" className="text-blue-400 hover:text-blue-300 mx-2">Terms of Service</a>
          <a href="#" className="text-blue-400 hover:text-blue-300 mx-2">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

