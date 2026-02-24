import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationPipeline from './pages/ApplicationPipeline';
import ManagerPortal from './pages/ManagerPortal';
import CHODashboard from './pages/CHODashboard';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.name)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<LandingPage />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'ta']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/pipeline" element={<ProtectedRoute allowedRoles={['admin', 'ta']}><ApplicationPipeline /></ProtectedRoute>} />
      <Route path="/manager/request" element={<ProtectedRoute allowedRoles={['manager']}><ManagerPortal /></ProtectedRoute>} />
      <Route path="/executive/approvals" element={<ProtectedRoute allowedRoles={['executive']}><CHODashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
