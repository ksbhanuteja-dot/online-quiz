import React from 'react';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import QuizPerformanceChart from '../components/QuizPerformanceChart';
import PassFailChart from '../components/PassFailChart';

const Dashboard = () => {
  const cards = [
    { title: 'Total Quizzes Created', value: '12', icon: '📝', color: 'border-l-4 border-blue-500' },
    { title: 'Total Participants', value: '1,234', icon: '👥', color: 'border-l-4 border-green-500' },
    { title: 'Average Score', value: '85%', icon: '📊', color: 'border-l-4 border-purple-500' },
    { title: 'Highest Score', value: '98%', icon: '🏆', color: 'border-l-4 border-yellow-500' },
  ];

  const quizData = [
    { name: 'Quiz 1', score: 85 },
    { name: 'Quiz 2', score: 92 },
    { name: 'Quiz 3', score: 78 },
    { name: 'Quiz 4', score: 88 },
  ];

  const passFailData = [
    { name: 'Pass', value: 750 },
    { name: 'Fail', value: 250 },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuizPerformanceChart data={quizData} />
        <PassFailChart data={passFailData} />
      </div>
    </Layout>
  );
};

export default Dashboard;