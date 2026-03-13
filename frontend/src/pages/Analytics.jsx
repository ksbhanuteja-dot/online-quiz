import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import api from '../services/api';

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get('quiz');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      api.get(`/analytics/?quiz_id=${quizId}`).then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      }).catch(() => {
        // Fallback to general analytics if quiz-specific not available
        api.get('/analytics/').then((res) => {
          setAnalytics(res.data);
          setLoading(false);
        });
      });
    } else {
      api.get('/analytics/').then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      });
    }
  }, [quizId]);

  if (loading) return <Layout><div>Loading...</div></Layout>;

  const cards = [
    { title: 'Total Quizzes', value: analytics?.total_quizzes || 0, icon: '📝', color: 'border-l-4 border-blue-500' },
    { title: 'Total Students', value: analytics?.total_students || 0, icon: '👥', color: 'border-l-4 border-green-500' },
    { title: 'Average Score', value: `${analytics?.average_score || 0}%`, icon: '📊', color: 'border-l-4 border-purple-500' },
  ];

  const leaderboardData = analytics?.quiz_performance?.map(quiz => ({
    name: quiz.title,
    score: quiz.average_score
  })) || [];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics {quizId && `(Quiz ${quizId})`}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leaderboardData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {leaderboardData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg mr-3">{index + 1}.</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-blue-600 font-bold">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;