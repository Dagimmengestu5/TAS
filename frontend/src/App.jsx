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
import { useAuth } from './context/AuthContext';

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
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/pipeline" element={<ApplicationPipeline />} />
      <Route path="/manager/request" element={<ManagerPortal />} />
      <Route path="/executive/approvals" element={<CHODashboard />} />
    </Routes>
  );
};

export default App;
