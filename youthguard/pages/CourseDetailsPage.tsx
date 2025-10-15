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

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-text-primary">Course not found</h2>
        <p className="text-text-secondary mt-2">The course you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <button 
          onClick={() => navigate('/courses')}
          className="flex items-center text-primary hover:text-blue-700 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Courses
        </button>
        
        <h1 className="text-3xl font-bold font-heading text-text-primary">
          {course.title}
        </h1>
        <p className="mt-2 text-text-secondary">
          {course.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              Course Overview
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-text-primary">Category</h3>
                <p className="text-text-secondary">{course.category}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Instructor</h3>
                <p className="text-text-secondary">{course.instructor}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Duration</h3>
                <p className="text-text-secondary">{course.duration} hours</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Difficulty</h3>
                <p className="text-text-secondary">{course.difficulty}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              Lessons ({lessons.length})
            </h2>
            {lessons.length > 0 ? (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson._id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-text-primary">
                        {index + 1}. {lesson.title}
                      </h3>
                      <span className="text-sm text-text-secondary">
                        {lesson.duration} min
                      </span>
                    </div>
                    <p className="text-text-secondary mt-2 text-sm">
                      {lesson.description}
                    </p>
                    {lesson.videoUrl && (
                      <div className="mt-3">
                        <a 
                          href={lesson.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-blue-700 text-sm flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-text-secondary">No lessons available for this course yet.</p>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              Course Actions
            </h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
                Enroll in Course
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;