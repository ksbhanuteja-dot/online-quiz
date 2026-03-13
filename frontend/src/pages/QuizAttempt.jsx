import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then((res) => {
      setQuiz(res.data);
      setTimeLeft(res.data.timer * 60);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (quiz) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSaveProgress = () => {
    api.post(`/quizzes/${id}/progress`, { answers });
    alert('Progress saved!');
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/quizzes/${id}/submit`, { answers });
      const { score, correct_answers, total_questions } = response.data;
      navigate('/result', { state: { score, correct: correct_answers, total: total_questions, timeTaken: quiz.timer * 60 - timeLeft } });
    } catch (error) {
      alert('Error submitting quiz');
    }
  };

  if (loading) return <div>Loading...</div>;

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">{quiz.title}</h1>
          <div className="text-white text-xl font-bold">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex space-x-4">
              <button
                onClick={handleSaveProgress}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Save Progress
              </button>
              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;