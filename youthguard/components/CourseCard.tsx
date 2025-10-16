import React from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';
import { ClockIcon, LevelIcon, StarIcon } from './icons';

interface CourseCardProps {
  course: Course;
  onEdit?: (id: string) => void;
}

const difficultyColorMap = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { course, onEdit } = props;
  
  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1560250099-28533a76c0a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
  };

  return (
    <motion.div 
      className="card card-hover overflow-hidden flex flex-col h-full hover-lift rounded-xl shadow-lg dark:shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="h-32 sm:h-40 md:h-48 w-full object-cover transition-transform duration-500" 
          src={course.thumbnail || 'https://images.unsplash.com/photo-1560250099-28533a76c0a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'} 
          alt={course.title} 
          onError={handleImageError}
        />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className={`px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold rounded-full ${difficultyColorMap[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-xs sm:text-sm text-primary font-medium mb-1 dark:text-blue-400">{course.category}</p>
          <h3 className="text-base sm:text-lg md:text-xl font-bold font-heading text-text-primary mb-1 md:mb-2 h-10 sm:h-12 dark:text-white">{course.title}</h3>
          <p className="text-xs sm:text-sm text-text-secondary mb-2 sm:mb-3 dark:text-gray-300">by {course.instructor}</p>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm text-text-secondary mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-accent dark:text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 dark:text-gray-300" />
            <span>{course.duration} hrs</span>
          </div>
        </div>
        {onEdit && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => props.onEdit && props.onEdit(course._id)}
              className="text-xs sm:text-sm font-medium text-primary hover:text-primary-dark transition-colors dark:text-blue-400 dark:hover:text-blue-300"
            >
              Edit Course
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;