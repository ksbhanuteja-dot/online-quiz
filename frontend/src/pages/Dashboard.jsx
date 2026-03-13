import React from 'react';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const cards = [
    { title: 'Total Quizzes Attempted', value: '12', icon: '📝', color: 'border-l-4 border-blue-500' },
    { title: 'Average Score', value: '85%', icon: '📊', color: 'border-l-4 border-green-500' },
    { title: 'Highest Score', value: '98%', icon: '🏆', color: 'border-l-4 border-purple-500' },
  ];

  const performanceData = [
    { date: '2023-10-01', score: 82 },
    { date: '2023-10-02', score: 85 },
    { date: '2023-10-03', score: 87 },
    { date: '2023-10-04', score: 84 },
    { date: '2023-10-05', score: 89 },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quiz Performance Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
};

export default Dashboard;