import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;