import React from 'react';
import Layout from '../components/Layout';
import QuizCard from '../components/QuizCard';

const Quizzes = () => {
  const quizzes = [
    { title: 'JavaScript Basics', description: 'Test your knowledge of JavaScript fundamentals.', questions: 10, duration: 15 },
    { title: 'React Advanced', description: 'Deep dive into React hooks and state management.', questions: 15, duration: 20 },
    { title: 'CSS Mastery', description: 'Master modern CSS techniques and layouts.', questions: 12, duration: 18 },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <QuizCard key={index} {...quiz} />
        ))}
      </div>
    </Layout>
  );
};

export default Quizzes;