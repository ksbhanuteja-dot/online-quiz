import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const History = () => {
  const { user } = useContext(AuthContext);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get(`/students/${user.id}/results`).then((res) => {
        setHistoryData(res.data);
        setLoading(false);
      });
    }
  }, [user]);

  const trendData = historyData.map((item, index) => ({
    attempt: index + 1,
    score: item.score
  }));

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz History</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.quiz_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.score}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};