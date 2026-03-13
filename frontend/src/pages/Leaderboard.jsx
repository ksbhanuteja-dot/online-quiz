import React from 'react';
import Layout from '../components/Layout';

const Leaderboard = () => {
  const leaderboardData = [
    { name: 'Alice Johnson', score: 95, time: '12:30', rank: 1 },
    { name: 'Bob Smith', score: 92, time: '13:15', rank: 2 },
    { name: 'Charlie Brown', score: 88, time: '14:00', rank: 3 },
    { name: 'Diana Prince', score: 85, time: '14:45', rank: 4 },
    { name: 'Eve Wilson', score: 82, time: '15:20', rank: 5 },
  ];

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-gray-100 text-gray-800';
      case 3:
        return 'bg-orange-100 text-orange-800';
      default:
        return '';
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leaderboard</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((item) => (
              <tr key={item.rank} className={item.rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankStyle(item.rank)}`}>
                    {item.rank}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.score}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Leaderboard;