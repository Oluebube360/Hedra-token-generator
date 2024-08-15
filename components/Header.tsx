import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">
            <a className="hover:text-gray-300">Digital ID DApp</a>
          </Link>
        </div>
        <div className="space-x-6">
          <Link href="/login">
            <a className="hover:text-gray-300">Login</a>
          </Link>
          <Link href="/dashboard">
            <a className="hover:text-gray-300">Dashboard</a>
          </Link>
          <Link href="/profile">
            <a className="hover:text-gray-300">Profile</a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
