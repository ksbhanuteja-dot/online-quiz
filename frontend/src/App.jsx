import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import QuizHistory from './pages/QuizHistory';
import Leaderboard from './pages/Leaderboard';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/history" element={<QuizHistory />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/quiz/:id" element={<QuizAttempt />} />
        <Route path="/result" element={<QuizResult />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
