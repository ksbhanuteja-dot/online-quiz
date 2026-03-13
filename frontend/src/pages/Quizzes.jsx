import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes/').then((res) => {
      setQuizzes(res.data);
      setLoading(false);
    });
  }, []);

  const handleStartQuiz = (id) => {
    navigate(`/quiz/${id}`);
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

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
              <span>{quiz.questions.length} questions</span>
              <span>{quiz.timer} min</span>
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