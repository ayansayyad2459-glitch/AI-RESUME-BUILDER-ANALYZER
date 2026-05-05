import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ResumeBuilder from './pages/ResumeBuilder';
import JobSuggestions from './pages/JobSuggestions';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-screen"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analyze" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobSuggestions /></ProtectedRoute>} />
          <Route path="/jobs/:resumeId" element={<ProtectedRoute><JobSuggestions /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
