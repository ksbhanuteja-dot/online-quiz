import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">QuizMaster</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-white">{user.email} ({user.role})</span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-500 font-bold">U</span>
              </div>
              <button
                onClick={logout}
                className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;