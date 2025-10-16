import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  HomeIcon, 
  BookIcon, 
  BriefcaseIcon, 
  ChartIcon, 
  MessageIcon, 
  UserIcon, 
  LogoutIcon,
  SunIcon,
  MoonIcon
} from './icons';

const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/courses', icon: <BookIcon className="h-5 w-5" />, label: 'Courses' },
    { to: '/jobs', icon: <BriefcaseIcon className="h-5 w-5" />, label: 'Job Board' },
    { to: '/progress', icon: <ChartIcon className="h-5 w-5" />, label: 'Progress' },
    { to: '/messages', icon: <MessageIcon className="h-5 w-5" />, label: 'Messages' },
    { to: '/profile', icon: <UserIcon className="h-5 w-5" />, label: 'Profile' },
  ];

  // Animation variants
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: 20 }
  };

  return (
    <>
      {/* Sidebar - always visible in dashboard layout */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg h-screen block dark:bg-gray-800`}
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <motion.div 
            className="flex items-center justify-between p-4 border-b dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">YG</span>
              </div>
              <span className="font-heading font-bold text-xl text-text-primary dark:text-white">YouthGuard</span>
            </motion.div>
          </motion.div>

          {/* Navigation items */}
          <nav className="flex-1 p-4">
            <motion.ul 
              className="space-y-2"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.07 } },
                closed: {}
              }}
            >
              {navItems.map((item, index) => (
                <motion.li 
                  key={item.to}
                  variants={itemVariants}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-text-secondary hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.icon}
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </nav>

          {/* Dark mode toggle and user info */}
          <motion.div 
            className="p-4 border-t dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={toggleDarkMode}
              className="flex items-center justify-between w-full px-4 py-3 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <motion.div
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SunIcon className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: 180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MoonIcon className="h-5 w-5" />
                  </motion.div>
                )}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="darkModeToggle"
                  id="darkModeToggle"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="sr-only"
                />
                <motion.div 
                  className={`block w-10 h-6 rounded-full ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}
                  animate={{ backgroundColor: darkMode ? '#2563eb' : '#d1d5db' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'transform translate-x-4' : ''}`}
                  animate={{ x: darkMode ? 16 : 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              </div>
            </motion.button>

            <motion.div 
              className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 dark:bg-gray-700" />
                <div>
                  <motion.p 
                    className="text-sm font-medium text-text-primary dark:text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {user?.firstName}
                  </motion.p>
                  <motion.p 
                    className="text-xs text-text-secondary dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    {user?.userType}
                  </motion.p>
                </div>
              </div>
              <motion.button
                onClick={handleLogout}
                className="p-2 text-text-secondary hover:text-red-500 rounded-full hover:bg-red-50 transition-colors dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogoutIcon className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardSidebar;