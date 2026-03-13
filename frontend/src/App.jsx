import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import ManageQuizzes from './pages/ManageQuizzes';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Quizzes from './pages/Quizzes';
import QuizHistory from './pages/QuizHistory';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-quiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
          <Route path="/edit-quiz/:id" element={<ProtectedRoute><EditQuiz /></ProtectedRoute>} />
          <Route path="/manage-quizzes" element={<ProtectedRoute><ManageQuizzes /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
