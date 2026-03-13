import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    timer: '',
    questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then((res) => {
      setQuiz(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    if (field === 'question') {
      newQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.split('-')[1]);
      newQuestions[index].options[optionIndex] = value;
    } else if (field === 'correct_answer') {
      newQuestions[index].correct_answer = parseInt(value);
    }
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { question: '', options: ['', '', '', ''], correct_answer: 0 }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/quizzes/${id}`, quiz);
      navigate('/manage-quizzes');
    } catch (error) {
      alert('Error updating quiz');
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={quiz.title}
                onChange={handleQuizChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timer (minutes)</label>
              <input
                type="number"
                name="timer"
                value={quiz.timer}
                onChange={handleQuizChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {quiz.questions.map((q, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Question {index + 1}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {q.options.map((option, optIndex) => (
                <div key={optIndex}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option {optIndex + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(index, `option-${optIndex}`, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
              <select
                value={q.correct_answer}
                onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {q.options.map((_, optIndex) => (
                  <option key={optIndex} value={optIndex}>Option {optIndex + 1}</option>
                ))}
              </select>
            </div>
            {quiz.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Remove Question
              </button>
            )}
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Update Quiz
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default EditQuiz;