import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { UserIcon, LogoutIcon, MessageIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
      isActive ? 'text-primary font-semibold' : 'text-text-secondary hover:text-primary dark:text-gray-300'
    }`;

  // Animation variants
  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  return (
    <motion.header 
      className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-4 sm:space-x-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NavLink 
              to="/" 
              className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105"
            >
              <motion.svg 
                className="h-6 w-6 sm:h-8 sm:w-8 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
              </motion.svg>
              <motion.span 
                className="font-heading font-bold text-lg sm:text-xl text-text-primary hidden xs:block dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                YouthGuard
              </motion.span>
            </NavLink>
            
            {/* Mobile menu button */}
            <motion.button 
              className="md:hidden text-text-secondary hover:text-primary focus:outline-none dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
            
            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex space-x-4 lg:space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
              <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
              <NavLink to="/jobs" className={navLinkClass}>Job Board</NavLink>
              <NavLink to="/progress" className={navLinkClass}>Progress</NavLink>
            </motion.nav>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3 sm:space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <NavLink to="/messages" className="relative p-1 sm:p-2 text-text-secondary hover:text-primary transform transition-all duration-300 hover:scale-110 dark:text-gray-300 dark:hover:text-white">
                <MessageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -top-1 -right-1 sm:top-0 sm:right-0 inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full notification-badge">
                  3
                </span>
              </NavLink>
            </motion.div>
            <motion.button 
              onClick={toggleDarkMode}
              className="p-1 sm:p-2 text-text-secondary hover:text-primary transform transition-all duration-300 hover:scale-110 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle dark mode"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </motion.button>
            <motion.span 
              className="text-sm font-medium text-text-primary hidden sm:inline dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome, {user?.firstName}
            </motion.span>
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110 dark:bg-gray-700 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
              <motion.div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto transform group-hover:translate-y-0 translate-y-2 z-50 dark:bg-gray-800"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
              >
                <NavLink to="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-700">My Profile</NavLink>
                <motion.button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200 dark:text-red-400 dark:hover:bg-gray-700"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogoutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Mobile Navigation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-3">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'text-primary bg-blue-50 dark:bg-gray-700' : 'text-text-secondary hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                    }`
                  } 
                  end
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/courses" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'text-primary bg-blue-50 dark:bg-gray-700' : 'text-text-secondary hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </NavLink>
                <NavLink 
                  to="/jobs" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'text-primary bg-blue-50 dark:bg-gray-700' : 'text-text-secondary hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Job Board
                </NavLink>
                <NavLink 
                  to="/progress" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'text-primary bg-blue-50 dark:bg-gray-700' : 'text-text-secondary hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Progress
                </NavLink>
                <NavLink 
                  to="/messages" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'text-primary bg-blue-50 dark:bg-gray-700' : 'text-text-secondary hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'text-primary bg-blue-50 dark:bg-gray-700' : 'text-text-secondary hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </NavLink>
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 text-left dark:text-red-400 dark:hover:bg-gray-700"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </nav>
            </div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;