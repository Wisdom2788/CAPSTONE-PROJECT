import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCourse, getCourseById, updateCourse } from '../services/api';
import { Course } from '../types';

const CourseEditPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    duration: 0,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    thumbnail: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await getCourseById(id!);
      const course: Course = response.data.data;
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        instructor: course.instructor,
        duration: course.duration,
        difficulty: course.difficulty,
        thumbnail: course.thumbnail,
        isActive: course.isActive,
      });
    } catch (err) {
      console.error('Failed to fetch course', err);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await updateCourse(id!, formData);
        setSuccess('Course updated successfully!');
      } else {
        await createCourse(formData);
        setSuccess('Course created successfully!');
      }
      
      setTimeout(() => {
        navigate('/courses');
      }, 1500);
    } catch (err) {
      console.error('Failed to save course', err);
      setError(isEditing ? 'Failed to update course' : 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="mt-2 text-text-secondary">
          {isEditing ? 'Update the course details below' : 'Fill in the details to create a new course'}
        </p>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4 slide-in-right">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4 slide-in-right">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 fade-in">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary">
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              placeholder="Enter course description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-primary">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
                placeholder="e.g., Programming, Design, Business"
              />
            </div>

            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-text-primary">
                Instructor
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
                placeholder="Instructor name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-text-primary">
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-text-primary">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center">
              <div className="flex items-center h-full">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-text-primary">
                  Active Course
                </label>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-text-primary">
              Thumbnail URL
            </label>
            <input
              type="text"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              placeholder="Enter image URL for course thumbnail"
            />
            {formData.thumbnail && (
              <div className="mt-3">
                <p className="text-sm text-text-secondary mb-2">Thumbnail Preview:</p>
                <img 
                  src={formData.thumbnail} 
                  alt="Course thumbnail preview" 
                  className="h-32 w-full object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1560250099-28533a76c0a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditPage;