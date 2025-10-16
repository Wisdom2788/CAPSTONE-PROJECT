import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    location: { state: '', city: '' }
  });
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginData.email, loginData.password);
    if (success) {
      onClose();
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      ...registerData,
      dateOfBirth: registerData.dateOfBirth || new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]
    };
    const success = await register(userData);
    if (success) {
      onClose();
      navigate('/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, formType: 'login' | 'register') => {
    const { name, value } = e.target;
    
    if (formType === 'login') {
      setLoginData({ ...loginData, [name]: value });
    } else {
      // Handle nested location fields
      if (name.startsWith('location.')) {
        const locationField = name.split('.')[1];
        setRegisterData({
          ...registerData,
          location: {
            ...registerData.location,
            [locationField]: value
          }
        });
      } else {
        setRegisterData({ ...registerData, [name]: value });
      }
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div 
                      className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
                      </svg>
                    </motion.div>
                    <motion.h2 
                      className="text-2xl font-bold font-heading text-text-primary dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      YouthGuard
                    </motion.h2>
                  </motion.div>
                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {view === 'login' ? (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.h3 
                        className="text-xl font-bold font-heading text-text-primary dark:text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Sign in to your account
                      </motion.h3>
                      <motion.p 
                        className="mt-1 text-text-secondary dark:text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Enter your credentials to access YouthGuard
                      </motion.p>
                    </motion.div>

                    {error && (
                      <motion.div 
                        className="bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-900 dark:border-red-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                      </motion.div>
                    )}

                    <motion.form 
                      className="space-y-4" 
                      onSubmit={handleLogin}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">
                          Email address
                        </label>
                        <motion.input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={loginData.email}
                          onChange={(e) => handleInputChange(e, 'login')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="you@example.com"
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">
                          Password
                        </label>
                        <motion.input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={loginData.password}
                          onChange={(e) => handleInputChange(e, 'login')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="••••••••"
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>

                      <motion.div 
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center">
                          <motion.input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                            whileTap={{ scale: 0.9 }}
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary dark:text-gray-300">
                            Remember me
                          </label>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                          disabled={loading}
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <motion.span 
                                className="loading-spinner mr-2 w-4 h-4 border-2"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <span>Signing in...</span>
                            </span>
                          ) : 'Sign in'}
                        </motion.button>
                      </motion.div>
                    </motion.form>

                    <motion.div 
                      className="text-center text-text-secondary text-sm dark:text-gray-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Don't have an account?{' '}
                      <motion.button 
                        onClick={() => setView('register')}
                        className="font-medium text-primary hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Sign up
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.h3 
                        className="text-xl font-bold font-heading text-text-primary dark:text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Create your account
                      </motion.h3>
                      <motion.p 
                        className="mt-1 text-text-secondary dark:text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Join YouthGuard to start your journey
                      </motion.p>
                    </motion.div>

                    {error && (
                      <motion.div 
                        className="bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-900 dark:border-red-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                      </motion.div>
                    )}

                    <motion.form 
                      className="space-y-4" 
                      onSubmit={handleRegister}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">First Name</label>
                          <motion.input 
                            name="firstName" 
                            type="text" 
                            required 
                            value={registerData.firstName}
                            onChange={(e) => handleInputChange(e, 'register')} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            whileFocus={{ scale: 1.02 }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">Last Name</label>
                          <motion.input 
                            name="lastName" 
                            type="text" 
                            required 
                            value={registerData.lastName}
                            onChange={(e) => handleInputChange(e, 'register')} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            whileFocus={{ scale: 1.02 }}
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">Email address</label>
                        <motion.input 
                          name="email" 
                          type="email" 
                          required 
                          value={registerData.email}
                          onChange={(e) => handleInputChange(e, 'register')} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">Phone Number</label>
                        <motion.input 
                          name="phoneNumber" 
                          type="tel" 
                          required 
                          value={registerData.phoneNumber}
                          onChange={(e) => handleInputChange(e, 'register')} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">Date of Birth</label>
                          <motion.input 
                            name="dateOfBirth" 
                            type="date" 
                            value={registerData.dateOfBirth}
                            onChange={(e) => handleInputChange(e, 'register')} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            whileFocus={{ scale: 1.02 }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">Gender</label>
                          <motion.select 
                            name="gender" 
                            value={registerData.gender}
                            onChange={(e) => handleInputChange(e, 'register')} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            whileFocus={{ scale: 1.02 }}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </motion.select>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">State</label>
                          <motion.input 
                            name="location.state" 
                            type="text" 
                            required 
                            value={registerData.location.state}
                            onChange={(e) => handleInputChange(e, 'register')} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            whileFocus={{ scale: 1.02 }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">City</label>
                          <motion.input 
                            name="location.city" 
                            type="text" 
                            required 
                            value={registerData.location.city}
                            onChange={(e) => handleInputChange(e, 'register')} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            whileFocus={{ scale: 1.02 }}
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <label className="block text-sm font-medium text-text-secondary mb-1 dark:text-gray-300">Password</label>
                        <motion.input 
                          name="password" 
                          type="password" 
                          required 
                          value={registerData.password}
                          onChange={(e) => handleInputChange(e, 'register')} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <motion.button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                          disabled={loading}
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <motion.span 
                                className="loading-spinner mr-2 w-4 h-4 border-2"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <span>Creating account...</span>
                            </span>
                          ) : 'Create account'}
                        </motion.button>
                      </motion.div>
                    </motion.form>

                    <motion.div 
                      className="text-center text-text-secondary text-sm dark:text-gray-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      Already have an account?{' '}
                      <motion.button 
                        onClick={() => setView('login')}
                        className="font-medium text-primary hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Sign in
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;