import React from 'react';
import { motion } from 'framer-motion';
// import CountUp from 'react-countup'; // Removed due to build issues

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  caption: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, caption }) => {
  return (
    <motion.div 
      className="card card-hover p-4 sm:p-6 h-full"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center bg-blue-100 text-primary transition-all duration-300 dark:bg-blue-900 dark:text-blue-300"
        >
          {icon}
        </motion.div>
        <div>
          <p className="text-xs sm:text-sm text-text-secondary font-medium dark:text-gray-300">{title}</p>
          <motion.p 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-text-primary mt-1 dark:text-white"
          >
            {value}
          </motion.p>
          <p className="text-xs text-text-secondary mt-1 hidden xs:block dark:text-gray-400">{caption}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;