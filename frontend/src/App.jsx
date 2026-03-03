import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerPortal from './pages/ManagerPortal';
import HrDashboard from './pages/HrDashboard';
import CeoDashboard from './pages/CeoDashboard';
import TADashboard from './pages/TADashboard';
import UserManagement from './pages/UserManagement';
import ManageCompanies from './pages/ManageCompanies';
import ManageDepartments from './pages/ManageDepartments';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import EnterOtp from './pages/EnterOtp';
import OAuthCallback from './pages/OAuthCallback';
import JobConsole from './pages/JobConsole';
import NotificationDetail from './pages/NotificationDetail';
import TAReport from './pages/TAReport';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';

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
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<LandingPage />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* Protected Routes */}
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><ManageCompanies /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><ManageDepartments /></ProtectedRoute>} />
        <Route path="/ta/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'ta_team', 'hr_approver', 'ceo_approver']}><TADashboard /></ProtectedRoute>} />
        <Route path="/ta/jobs" element={<ProtectedRoute allowedRoles={['admin', 'ta_team']}><JobConsole /></ProtectedRoute>} />
        <Route path="/ta/reports" element={<ProtectedRoute allowedRoles={['admin', 'ta_team']}><TAReport /></ProtectedRoute>} />
        <Route path="/manager/request" element={<ProtectedRoute allowedRoles={['hiring_manager', 'admin', 'hr_approver', 'ceo_approver']}><ManagerPortal /></ProtectedRoute>} />
        <Route path="/hr/approvals" element={<ProtectedRoute allowedRoles={['hr_approver', 'admin', 'ceo_approver']}><HrDashboard /></ProtectedRoute>} />
        <Route path="/ceo/approvals" element={<ProtectedRoute allowedRoles={['ceo_approver', 'admin']}><CeoDashboard /></ProtectedRoute>} />
        <Route path="/notifications/:id" element={<ProtectedRoute><NotificationDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </MainLayout>
  );
};

export default App;
