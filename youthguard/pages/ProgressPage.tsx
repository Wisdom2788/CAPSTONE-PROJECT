import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProgress, getCourseProgress, getCourseCompletion } from '../services/api';
import { Course } from '../types';

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you would fetch actual course data
  // For now, we'll simulate with dummy data
  useEffect(() => {
    // Simulate fetching courses and progress data
    const dummyCourses: Course[] = [
      {
        _id: '1',
        title: 'Introduction to Cybersecurity',
        description: 'Learn the basics of cybersecurity to protect yourself and your organization.',
        category: 'Cybersecurity',
        instructor: 'Dr. Jane Smith',
        duration: 12,
        difficulty: 'Beginner',
        thumbnail: 'https://via.placeholder.com/300x200',
        enrollmentCount: 1200,
        rating: 4.8,
        isActive: true,
        createdBy: 'admin',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z'
      },
      {
        _id: '2',
        title: 'Web Development Fundamentals',
        description: 'Master the core concepts of web development including HTML, CSS, and JavaScript.',
        category: 'Web Development',
        instructor: 'John Doe',
        duration: 18,
        difficulty: 'Intermediate',
        thumbnail: 'https://via.placeholder.com/300x200',
        enrollmentCount: 950,
        rating: 4.6,
        isActive: true,
        createdBy: 'admin',
        createdAt: '2023-02-20T00:00:00Z',
        updatedAt: '2023-02-20T00:00:00Z'
      },
      {
        _id: '3',
        title: 'Data Analysis with Python',
        description: 'Learn how to analyze and visualize data using Python libraries.',
        category: 'Data Science',
        instructor: 'Sarah Johnson',
        duration: 15,
        difficulty: 'Intermediate',
        thumbnail: 'https://via.placeholder.com/300x200',
        enrollmentCount: 780,
        rating: 4.9,
        isActive: true,
        createdBy: 'admin',
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2023-03-10T00:00:00Z'
      }
    ];

    const dummyProgressData = [
      {
        courseId: '1',
        courseTitle: 'Introduction to Cybersecurity',
        progress: 75,
        lessonsCompleted: 9,
        totalLessons: 12,
        lastAccessed: '2023-05-15T14:30:00Z'
      },
      {
        courseId: '2',
        courseTitle: 'Web Development Fundamentals',
        progress: 40,
        lessonsCompleted: 7,
        totalLessons: 18,
        lastAccessed: '2023-05-10T09:15:00Z'
      },
      {
        courseId: '3',
        courseTitle: 'Data Analysis with Python',
        progress: 20,
        lessonsCompleted: 3,
        totalLessons: 15,
        lastAccessed: '2023-05-05T16:45:00Z'
      }
    ];

    setCourses(dummyCourses);
    setProgressData(dummyProgressData);
    setLoading(false);
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-text-primary">
          Learning Progress
        </h1>
        <p className="mt-1 text-text-secondary">
          Track your progress and continue your learning journey.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-primary">Courses Enrolled</h3>
          <p className="text-3xl font-bold text-primary mt-2">{courses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-primary">In Progress</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">
            {progressData.filter(p => p.progress > 0 && p.progress < 100).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-primary">Completed</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {progressData.filter(p => p.progress === 100).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-primary">Avg. Progress</h3>
          <p className="text-3xl font-bold text-blue-500 mt-2">
            {progressData.length 
              ? Math.round(progressData.reduce((sum, p) => sum + p.progress, 0) / progressData.length) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Progress by Course */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold font-heading text-text-primary mb-6">
          Progress by Course
        </h2>
        <div className="space-y-6">
          {progressData.map((progress, index) => (
            <div key={progress.courseId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {progress.courseTitle}
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {progress.lessonsCompleted} of {progress.totalLessons} lessons completed
                  </p>
                  <p className="text-text-secondary text-sm">
                    Last accessed: {new Date(progress.lastAccessed).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <span className="text-lg font-semibold text-text-primary">
                    {progress.progress}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getProgressColor(progress.progress)}`} 
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-3">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold font-heading text-text-primary mb-6">
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="mx-auto bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary mt-2">First Course</h3>
            <p className="text-text-secondary text-sm mt-1">Completed your first course</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary mt-2">Quick Learner</h3>
            <p className="text-text-secondary text-sm mt-1">Completed 5 lessons in one day</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary mt-2">Consistency</h3>
            <p className="text-text-secondary text-sm mt-1">7 days in a row of learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;