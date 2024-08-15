import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Digital ID DApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
