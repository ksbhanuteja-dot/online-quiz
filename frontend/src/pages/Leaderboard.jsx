import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard/').then((res) => {
      setLeaderboardData(res.data);
      setLoading(false);
    });
  }, []);

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

  if (loading) return <Layout><div>Loading...</div></Layout>;

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
            {leaderboardData.map((item, index) => (
              <tr
                key={index}
                className={`${item.name === user?.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''} ${index + 1 <= 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankStyle(index + 1)}`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name} {item.name === user?.name && <span className="text-blue-500">(You)</span>}
                </td>
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