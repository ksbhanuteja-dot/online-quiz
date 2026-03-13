import React from 'react';

const EmptyState = ({ message, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;