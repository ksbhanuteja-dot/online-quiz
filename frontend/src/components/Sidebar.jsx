import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const instructorMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Create Quiz', path: '/create-quiz', icon: '➕' },
    { name: 'Manage Quizzes', path: '/manage-quizzes', icon: '📝' },
    { name: 'Analytics', path: '/analytics', icon: '📊' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
  ];

  const studentMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Available Quizzes', path: '/quizzes', icon: '📝' },
    { name: 'Quiz History', path: '/history', icon: '📚' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
  ];

  const menuItems = user?.role === 'instructor' ? instructorMenu : studentMenu;

  return (
    <aside className="w-64 bg-white shadow-lg h-full">
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;