import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';

const Analytics = () => {
  const cards = [
    { title: 'Number of Participants', value: '1,234', icon: '👥', color: 'border-l-4 border-blue-500' },
    { title: 'Average Score', value: '85%', icon: '📊', color: 'border-l-4 border-green-500' },
    { title: 'Highest Score', value: '98%', icon: '🏆', color: 'border-l-4 border-purple-500' },
  ];

  const scoreData = [
    { name: 'Alice', score: 95 },
    { name: 'Bob', score: 88 },
    { name: 'Charlie', score: 92 },
    { name: 'Diana', score: 78 },
    { name: 'Eve', score: 85 },
  ];

  const trendData = [
    { date: '2023-10-01', averageScore: 82 },
    { date: '2023-10-02', averageScore: 85 },
    { date: '2023-10-03', averageScore: 87 },
    { date: '2023-10-04', averageScore: 84 },
    { date: '2023-10-05', averageScore: 89 },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Participant Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Score Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="averageScore" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;