import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ attempted: 0, average: 0, highest: 0 });
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    if (user?.role === 'student') {
      api.get(`/students/${user.id}/results`).then((res) => {
        const results = res.data;
        const attempted = results.length;
        const scores = results.map(r => r.score);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length || 0;
        const highest = Math.max(...scores) || 0;
        setStats({ attempted, average: Math.round(average), highest });
        setPerformanceData(results.map((r, i) => ({ attempt: i + 1, score: r.score })));
      });
    }
  }, [user]);

  const cards = [
    { title: 'Total Quizzes Attempted', value: stats.attempted, icon: '📝', color: 'border-l-4 border-blue-500' },
    { title: 'Average Score', value: `${stats.average}%`, icon: '📊', color: 'border-l-4 border-green-500' },
    { title: 'Highest Score', value: `${stats.highest}%`, icon: '🏆', color: 'border-l-4 border-purple-500' },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{user?.role === 'instructor' ? 'Instructor' : 'Student'} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      {user?.role === 'student' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quiz Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;