import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, getLessonsForCourse } from '../services/api';
import { Course, Lesson } from '../types';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await getCourseById(id!);
        setCourse(courseResponse.data.data);
        
        // Fetch lessons for this course
        const lessonsResponse = await getLessonsForCourse(id!);
        setLessons(lessonsResponse.data.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load course details');
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 slide-in-right">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12 sm:py-16 slide-up">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Course not found</h2>
        <p className="text-text-secondary mt-2">The course you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/courses')}
          className="btn-primary mt-4 sm:mt-6"
        >
          Browse All Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 fade-in">
      <div className="slide-up">
        <button 
          onClick={() => navigate('/courses')}
          className="flex items-center text-primary hover:text-blue-700 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Courses
        </button>
        
        <div className="relative">
          <img 
            src={course.thumbnail || 'https://images.unsplash.com/photo-1560250099-28533a76c0a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'} 
            alt={course.title} 
            className="h-48 sm:h-64 w-full object-cover rounded-xl"
          />
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-primary text-white text-xs sm:text-sm font-semibold rounded-full">
              {course.category}
            </span>
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary mt-4 sm:mt-6">
          {course.title}
        </h1>
        <p className="mt-2 sm:mt-4 text-text-secondary text-base sm:text-lg">
          {course.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-6 slide-up animation-delay-100">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6">
              Course Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Category</h3>
                <p className="text-text-secondary mt-1 text-sm">{course.category}</p>
              </div>
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Instructor</h3>
                <p className="text-text-secondary mt-1 text-sm">{course.instructor}</p>
              </div>
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Duration</h3>
                <p className="text-text-secondary mt-1 text-sm">{course.duration} hours</p>
              </div>
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Difficulty</h3>
                <p className="text-text-secondary mt-1 text-sm">{course.difficulty}</p>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6 slide-up animation-delay-200">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6">
              Lessons ({lessons.length})
            </h2>
            {lessons.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson._id} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:bg-gray-50 transition-all duration-300 hover-lift">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <h3 className="font-semibold text-text-primary text-sm sm:text-base">
                        {index + 1}. {lesson.title}
                      </h3>
                      <span className="text-xs sm:text-sm text-text-secondary mt-1 sm:mt-0">
                        {lesson.duration} min
                      </span>
                    </div>
                    <p className="text-text-secondary mt-2 text-xs sm:text-sm">
                      {lesson.description}
                    </p>
                    {lesson.videoUrl && (
                      <div className="mt-2 sm:mt-3">
                        <a 
                          href={lesson.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-blue-700 text-xs sm:text-sm flex items-center transition-colors"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Watch Video
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm">No lessons available for this course yet.</p>
            )}
          </div>
        </div>

        <div className="slide-up animation-delay-300">
          <div className="card p-4 sm:p-6 sticky top-4 sm:top-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6">
              Course Actions
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <button className="btn-primary w-full text-sm sm:text-base">
                Enroll in Course
              </button>
              <button className="btn-outline w-full text-sm sm:text-base">
                Save for Later
              </button>
            </div>
            
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-text-primary mb-3 sm:mb-4 text-sm sm:text-base">Course Rating</h3>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= course.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-text-primary font-medium text-sm sm:text-base">{course.rating}</span>
              </div>
              <p className="text-text-secondary text-xs sm:text-sm mt-2">{course.enrollmentCount} students enrolled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;