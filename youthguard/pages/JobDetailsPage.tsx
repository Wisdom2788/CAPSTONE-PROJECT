import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyForJob } from '../services/api';
import { Job } from '../types';
import { useAuth } from '../hooks/useAuth';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeUrl: ''
  });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const jobResponse = await getJobById(id!);
        setJob(jobResponse.data.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details');
        setLoading(false);
      }
    };

    if (id) {
      fetchJobData();
    }
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApplying(true);
      
      // Submit application
      const applicationData = {
        jobId: id,
        userId: user?._id,
        coverLetter: formData.coverLetter,
        resumeUrl: formData.resumeUrl
      };
      
      await applyForJob(applicationData);
      
      // Reset form and show success message
      setFormData({
        coverLetter: '',
        resumeUrl: ''
      });
      setShowApplicationForm(false);
      
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  if (!job) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-text-primary">Job not found</h2>
        <p className="text-text-secondary mt-2">The job you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/jobs')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <button 
          onClick={() => navigate('/jobs')}
          className="flex items-center text-primary hover:text-blue-700 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </button>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <h1 className="text-3xl font-bold font-heading text-text-primary">
              {job.title}
            </h1>
            <p className="mt-2 text-text-secondary">
              {job.company} • {job.location}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {job.jobType}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-text-secondary">
                {job.description}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              Requirements
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              Salary Range
            </h2>
            <p className="text-text-secondary">
              {job.salaryRange}
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-4">
              Job Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-text-primary">Location</h3>
                <p className="text-text-secondary">{job.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Job Type</h3>
                <p className="text-text-secondary">{job.jobType}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Experience</h3>
                <p className="text-text-secondary">{job.experienceLevel}</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Application Deadline</h3>
                <p className="text-text-secondary">
                  {job.applicationDeadline 
                    ? new Date(job.applicationDeadline).toLocaleDateString() 
                    : 'No deadline specified'}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {!showApplicationForm ? (
                <button 
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply for this Job
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Resume URL
                    </label>
                    <input
                      type="text"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://example.com/resume.pdf"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={applying}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;