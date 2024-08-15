import React from 'react';

interface IdentityCardProps {
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ name, email, phone, imageUrl }) => {
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg p-6">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-bold text-center text-gray-800">{name}</h2>
      <p className="text-center text-gray-600">{email}</p>
      <p className="text-center text-gray-600">{phone}</p>
    </div>
  );
};

export default IdentityCard;
