import React from 'react';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      </header>
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-bold text-gray-800">Your Identity</h2>
            <p className="text-gray-600 mt-2">Manage and update your identity details here.</p>
            <Link href="/profile">
              <a className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                Manage Identity
              </a>
            </Link>
          </div>
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            <p className="text-gray-600 mt-2">View your recent identity-related transactions and verifications.</p>
            <Link href="/activity">
              <a className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                View Activity
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
