import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const ManageQuizzes = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'instructor') {
      api.get('/quizzes/').then((res) => {
        // Filter quizzes by instructor
        const instructorQuizzes = res.data.filter(quiz => quiz.instructor_id === user.id);
        setQuizzes(instructorQuizzes);
        setLoading(false);
      });
    }
  }, [user]);

  const handleEdit = (id) => {
    navigate(`/edit-quiz/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/quizzes/${id}`);
        setQuizzes(quizzes.filter(quiz => quiz.id !== id));
        alert('Quiz deleted successfully');
      } catch (error) {
        alert('Error deleting quiz');
      }
    }
  };

  const handleViewAnalytics = (id) => {
    navigate(`/analytics?quiz=${id}`);
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Quizzes</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quiz.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.questions.length}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.timer} min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(quiz.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(quiz.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="text-red-600 hover:text-red-900 mr-4"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewAnalytics(quiz.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Analytics
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ManageQuizzes;