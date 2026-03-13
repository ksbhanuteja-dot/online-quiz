import React from 'react';
import Layout from '../components/Layout';

const ManageQuizzes = () => {
  const quizzes = [
    { id: 1, title: 'JavaScript Basics', questions: 10, duration: 15, created: '2023-10-01' },
    { id: 2, title: 'React Advanced', questions: 15, duration: 20, created: '2023-10-05' },
    { id: 3, title: 'CSS Mastery', questions: 12, duration: 18, created: '2023-10-10' },
  ];

  const handleEdit = (id) => {
    console.log('Edit quiz', id);
    // Navigate to edit page or open modal
  };

  const handleDelete = (id) => {
    console.log('Delete quiz', id);
    // Confirm and delete
  };

  const handleViewAnalytics = (id) => {
    console.log('View analytics for quiz', id);
    // Navigate to analytics
  };

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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.questions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.duration} min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.created}</td>
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