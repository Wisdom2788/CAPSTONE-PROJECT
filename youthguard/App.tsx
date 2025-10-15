import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import MessagesPage from './pages/MessagesPage';
import ProgressPage from './pages/ProgressPage';
import Layout from './components/Layout';

const ProtectedRoute: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Navigate to="/login" replace />;
  }
  const { isAuthenticated } = authContext;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AuthRedirect: React.FC = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
      return <Outlet />;
    }
    const { isAuthenticated } = authContext;
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<AuthRedirect />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          <Route element={<Layout><ProtectedRoute /></Layout>}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Add other protected routes here */}
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;