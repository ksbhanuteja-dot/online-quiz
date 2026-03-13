import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Quizzes = () => {
  const navigate = useNavigate();

  const quizzes = [
    { id: 1, title: 'JavaScript Basics', description: 'Test your knowledge of JavaScript fundamentals.', questions: 10, duration: 15 },
    { id: 2, title: 'React Advanced', description: 'Deep dive into React hooks and state management.', questions: 15, duration: 20 },
    { id: 3, title: 'CSS Mastery', description: 'Master modern CSS techniques and layouts.', questions: 12, duration: 18 },
  ];

  const handleStartQuiz = (id) => {
    navigate(`/quiz/${id}`);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>{quiz.questions} questions</span>
              <span>{quiz.duration} min</span>
            </div>
            <button
              onClick={() => handleStartQuiz(quiz.id)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Quizzes;