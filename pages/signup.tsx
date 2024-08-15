import React, { useState } from 'react';
import { useRouter } from 'next/router';
import FormInput from '../components/FormInput';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Add signup logic here
    router.push('/dashboard'); // Redirect after signup
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center">Sign Up</h1>
      <form onSubmit={handleSignup} className="max-w-md mx-auto mt-8">
        <FormInput 
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormInput 
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type="submit" 
          className="w-full bg-indigo-500 text-white py-2 rounded-md mt-4">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
