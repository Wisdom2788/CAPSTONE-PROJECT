import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getCourses } from '../services/api';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCourses();
        setCourses(response.data.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(courses.map(c => c.category))];
    return ['All', ...uniqueCategories];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses
      .filter(course => categoryFilter === 'All' || course.category === categoryFilter)
      .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [courses, categoryFilter, searchTerm]);

  if (error) {
    return (
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-red-50 border border-red-200 rounded-md p-4 slide-in-right dark:bg-red-900 dark:border-red-700"
      >
        <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary"
            >
              Explore Courses
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-1 sm:mt-2 text-text-secondary text-base sm:text-lg"
            >
              Find the right course to boost your skills and career.
            </motion.p>
          </div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 sm:mt-0"
          >
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#/courses/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
            >
              Create New Course
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-grow">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </motion.select>
        </div>
      </motion.div>

      {/* Course Grid */}
      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="loading-spinner"></div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + (index % 3) * 0.1 }}
              className={`bounce-in animation-delay-${(index % 3) * 100}`}
            >
              <CourseCard 
                course={course} 
                onEdit={(id) => window.location.hash = `/courses/${id}/edit`} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      { !loading && filteredCourses.length === 0 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-12 sm:py-16"
        >
            <h3 className="text-xl sm:text-2xl font-semibold text-text-primary">No courses found</h3>
            <p className="text-text-secondary mt-2">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoursesPage;