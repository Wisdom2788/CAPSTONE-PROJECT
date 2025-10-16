import React, { useState, useEffect } from 'react';
import { motion, Transition } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { BookIcon, BriefcaseIcon, ChartIcon, ShieldCheckIcon, SunIcon, MoonIcon } from '../components/icons';

interface LandingPageProps {
  openAuthModal: (view: 'login' | 'register') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ openAuthModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200
      }
    }
  };

  const floatingAnimation: Transition = {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </motion.div>
              <motion.span 
                className="ml-3 text-2xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                YouthGuard
              </motion.span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button 
                onClick={toggleDarkMode}
                className="p-2 text-text-secondary hover:text-primary transform transition-all duration-300 hover:scale-110 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </motion.button>
              <motion.button 
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300 dark:text-gray-300 dark:hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button 
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:bg-blue-900"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={floatingAnimation}
          />
          <motion.div 
            className="absolute top-40 right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:bg-indigo-900"
            animate={{ 
              y: [0, 15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:bg-purple-900"
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
              variants={itemVariants}
            >
              Empowering Youth for the
              <motion.span 
                className="block text-primary bg-clip-text"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Digital Future
              </motion.span>
            </motion.h1>
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-xl text-gray-300"
              variants={itemVariants}
            >
              YouthGuard provides comprehensive learning paths, career opportunities, and mentorship to help young people succeed in the tech industry.
            </motion.p>
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              variants={itemVariants}
              transition={{ delay: 0.4 } as Transition}
            >
              <motion.button 
                onClick={() => openAuthModal('register')}
                className="px-8 py-4 text-base font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 25px rgba(37, 99, 235, 0.4)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Start Your Journey
              </motion.button>
              <motion.button 
                onClick={() => openAuthModal('login')}
                className="px-8 py-4 text-base font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg shadow-lg transition-all duration-300 border border-gray-700"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 25px rgba(0, 0, 0, 0.3)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Everything You Need to Succeed</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Our platform provides all the tools and resources to help you grow your career.
            </p>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { icon: <BookIcon className="h-6 w-6 text-primary" />, title: "Comprehensive Courses", description: "Access hundreds of courses taught by industry experts to build in-demand skills." },
              { icon: <BriefcaseIcon className="h-6 w-6 text-green-600" />, title: "Job Opportunities", description: "Discover career opportunities tailored to your skills and interests." },
              { icon: <ChartIcon className="h-6 w-6 text-purple-600" />, title: "Progress Tracking", description: "Monitor your learning progress and career development with detailed analytics." },
              { icon: <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />, title: "Mentorship", description: "Connect with experienced professionals who can guide your career journey." }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-8 rounded-xl transition-all duration-300 dark:bg-gray-700"
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)",
                  scale: 1.02
                }}
                transition={{ type: "spring", damping: 12, stiffness: 200 } as Transition}
              >
                <motion.div 
                  className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h3 
                  className="mt-6 text-xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="mt-2 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Success Stories</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Hear from young professionals who transformed their careers with YouthGuard.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { name: "Alex Johnson", role: "Software Engineer", quote: "YouthGuard helped me transition from a beginner to a professional developer in just 6 months. The courses and mentorship were invaluable." },
              { name: "Sarah Williams", role: "UX Designer", quote: "The job board and career resources helped me land my dream job at a top tech company. I couldn't be happier with my experience." },
              { name: "Michael Chen", role: "Data Scientist", quote: "The progress tracking and personalized learning paths helped me stay focused and achieve my goals faster than I ever imagined." }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 dark:bg-gray-800"
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", damping: 12, stiffness: 200 } as Transition}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic dark:text-gray-300">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-primary to-blue-700 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:bg-blue-900"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:bg-indigo-900"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-extrabold text-white"
              variants={itemVariants}
            >
              Ready to Transform Your Future?
            </motion.h2>
            <motion.p 
              className="mt-4 max-w-2xl mx-auto text-xl text-blue-100"
              variants={itemVariants}
              transition={{ delay: 0.2 } as Transition}
            >
              Join thousands of young professionals who have advanced their careers with YouthGuard.
            </motion.p>
            <motion.div 
              className="mt-10"
              variants={itemVariants}
              transition={{ delay: 0.4 } as Transition}
            >
              <motion.button 
                onClick={() => openAuthModal('register')}
                className="px-8 py-4 text-base font-medium text-primary bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 25px rgba(255, 255, 255, 0.3)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div 
              className="animate-fade-in-up"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <motion.div 
                  className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <ShieldCheckIcon className="h-5 w-5 text-white" />
                </motion.div>
                <span className="ml-2 text-xl font-bold">YouthGuard</span>
              </div>
              <p className="mt-4 text-gray-400">
                Empowering the next generation of tech professionals.
              </p>
            </motion.div>
            <motion.div 
              className="animate-fade-in-up animation-delay-200"
              variants={itemVariants}
              transition={{ delay: 0.2 } as Transition}
            >
              <h3 className="text-lg font-semibold">Platform</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Courses</Link></li>
                <li><Link to="/jobs" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Jobs</Link></li>
                <li><Link to="/#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Mentors</Link></li>
              </ul>
            </motion.div>
            <motion.div 
              className="animate-fade-in-up animation-delay-400"
              variants={itemVariants}
              transition={{ delay: 0.4 } as Transition}
            >
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Blog</Link></li>
                <li><Link to="/#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</Link></li>
                <li><Link to="/#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Community</Link></li>
              </ul>
            </motion.div>
            <motion.div 
              className="animate-fade-in-up animation-delay-600"
              variants={itemVariants}
              transition={{ delay: 0.6 } as Transition}
            >
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">About</Link></li>
                <li><Link to="/#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Careers</Link></li>
                <li><Link to="/#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Contact</Link></li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <p>&copy; {new Date().getFullYear()} YouthGuard. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;