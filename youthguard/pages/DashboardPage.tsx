import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import { BookIcon, BriefcaseIcon, MessageIcon } from '../components/icons';
import CourseCard from '../components/CourseCard';
import JobCard from '../components/JobCard';
import { getCourses, getJobs, getUnreadMessages } from '../services/api';
import { Course, Job } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const coursesResponse = await getCourses();
        setCourses(coursesResponse.data.data.slice(0, 2));
        
        // Fetch jobs
        const jobsResponse = await getJobs();
        setJobs(jobsResponse.data.data.slice(0, 2));
        
        // Fetch unread messages count
        if (user?._id) {
          const messagesResponse = await getUnreadMessages(user._id);
          setUnreadMessages(messagesResponse.data.data.length);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-text-secondary">
          Let's continue your journey to success.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<BookIcon className="h-6 w-6" />}
          title="Courses Enrolled"
          value="5"
          caption="2 courses in progress"
        />
        <StatCard 
          icon={<BriefcaseIcon className="h-6 w-6" />}
          title="Jobs Applied"
          value="3"
          caption="1 new interview request"
        />
        <StatCard 
          icon={<MessageIcon className="h-6 w-6" />}
          title="Unread Messages"
          value={unreadMessages.toString()}
          caption="From mentors and peers"
        />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-text-primary mb-4">
          Continue Where You Left Off
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map(course => <CourseCard key={course._id} course={course} />)}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold font-heading text-text-primary mb-4">
          Recommended Job Openings
        </h2>
        <div className="space-y-4">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;