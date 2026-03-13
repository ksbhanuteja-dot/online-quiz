import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, correct, total, timeTaken } = location.state || { score: 0, correct: 0, total: 0, timeTaken: 0 };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Quiz Completed!</h1>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <div className="text-4xl font-bold text-blue-500 mb-2">{score}%</div>
          <p className="text-gray-600">Your Score</p>
        </div>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Correct Answers:</span>
            <span className="font-semibold">{correct} / {total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Incorrect Answers:</span>
            <span className="font-semibold">{total - correct} / {total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Taken:</span>
            <span className="font-semibold">{formatTime(timeTaken)}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            View Leaderboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;