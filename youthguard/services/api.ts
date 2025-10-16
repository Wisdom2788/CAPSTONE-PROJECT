import axios from 'axios';
import { Course, Job, User } from '../types';

// Set up axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const registerUser = (userData: any) => 
  api.post('/auth/register', userData);

export const loginUser = (credentials: { email: string; password: string }) => 
  api.post('/auth/login', credentials);

export const getUserProfile = () => 
  api.get('/users/profile');

export const updateUserProfile = (userData: any) => 
  api.put('/users/profile', userData);

// Course API
export const getCourses = () => 
  api.get('/courses');

export const getCourseById = (id: string) => 
  api.get(`/courses/${id}`);

export const createCourse = (courseData: Partial<Course>) => 
  api.post('/courses', courseData);

export const updateCourse = (id: string, courseData: Partial<Course>) => 
  api.put(`/courses/${id}`, courseData);

export const deleteCourse = (id: string) => 
  api.delete(`/courses/${id}`);

export const getLessonsForCourse = (courseId: string) => 
  api.get(`/courses/${courseId}/lessons`);

// Job API
export const getJobs = () => 
  api.get('/jobs');

export const getJobById = (id: string) => 
  api.get(`/jobs/${id}`);

export const createJob = (jobData: Partial<Job>) => 
  api.post('/jobs', jobData);

export const updateJob = (id: string, jobData: Partial<Job>) => 
  api.put(`/jobs/${id}`, jobData);

export const deleteJob = (id: string) => 
  api.delete(`/jobs/${id}`);

export const applyForJob = (applicationData: any) => 
  api.post('/jobs/apply', applicationData);

export const getUserApplications = (userId: string) => 
  api.get(`/users/${userId}/applications`);

// Messaging API
export const sendMessage = (messageData: any) => 
  api.post('/messages', messageData);

export const getMessagesBetweenUsers = (userId1: string, userId2: string) => 
  api.get(`/messages/${userId1}/${userId2}`);

export const getUnreadMessages = (userId: string) => 
  api.get(`/users/${userId}/messages/unread`);

export const markMessageAsRead = (messageId: string) => 
  api.put(`/messages/${messageId}/read`);

// Progress API
export const updateProgress = (progressData: any) => 
  api.post('/progress', progressData);

export const getUserProgress = (userId: string) => 
  api.get(`/progress/${userId}`);

export const getCourseProgress = (userId: string, courseId: string) => 
  api.get(`/progress/${userId}/${courseId}`);

export const getCourseCompletion = (userId: string, courseId: string) => 
  api.get(`/progress/${userId}/${courseId}/completion`);