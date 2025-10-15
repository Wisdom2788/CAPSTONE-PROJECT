
export interface Location {
  state: string;
  city: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  location: Location;
  userType: 'Youth' | 'Mentor' | 'Employer';
  accountStatus: 'active' | 'inactive';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: number; // in hours
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  enrollmentCount: number;
  rating: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salaryMin?: number;
  salaryMax?: number;
  requirements: string[];
  skills: string[];
  applicationDeadline: string;
  isActive: boolean;
  postedBy: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
