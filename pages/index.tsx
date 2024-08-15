import React from 'react';
import Head from 'next/head';
import Link from 'next/link';


const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Digital Identity DApp</title>
        <meta name="description" content="Manage your digital identity securely using Hedera Hashgraph" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     

      <main className="flex-grow">
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-8">Welcome to the Digital ID DApp</h1>
            <p className="text-xl text-gray-600 mb-12">Securely manage your identity using blockchain technology on Hedera Hashgraph.</p>

            <div className="space-x-4">
              <Link href="/login">
                <a className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">
                  Get Started
                </a>
              </Link>
              <Link href="/profile">
                <a className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700">
                  Manage Profile
                </a>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Our Digital Identity DApp?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our application offers state-of-the-art security, privacy, and transparency for managing your identity on the blockchain. 
              Powered by Hedera Hashgraph, you are in control of your personal data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Decentralized & Secure</h3>
                <p className="text-gray-600">Your identity is managed on a decentralized, secure platform where you have complete control over your data.</p>
              </div>
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Hedera-Powered</h3>
                <p className="text-gray-600">Built on the Hedera Hashgraph network, offering low-cost, high-speed transactions.</p>
              </div>
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Easy to Use</h3>
                <p className="text-gray-600">An intuitive interface that simplifies managing your digital identity.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

  
    </div>
  );
};

export default Home;
