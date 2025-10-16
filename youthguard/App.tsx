import React, { useContext, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import MessagesPage from './pages/MessagesPage';
import ProgressPage from './pages/ProgressPage';
import CourseEditPage from './pages/CourseEditPage';
import JobEditPage from './pages/JobEditPage';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import AuthModal from './components/AuthModal';

// Simple layout without sidebar for landing page
const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {children}
    </div>
  );
};

const ProtectedRoute: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Navigate to="/" replace />;
  }
  const { isAuthenticated } = authContext;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const openAuthModal = (view: 'login' | 'register') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={
              <SimpleLayout>
                <LandingPage openAuthModal={openAuthModal} />
              </SimpleLayout>
            } />
          
          <Route element={<Layout><ProtectedRoute /></Layout>}>
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/new" element={<CourseEditPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/courses/:id/edit" element={<CourseEditPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/new" element={<JobEditPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/jobs/:id/edit" element={<JobEditPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Add other protected routes here */}
          </Route>
          
          {/* Dashboard route with its own layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
          initialView={authView} 
        />
      </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;