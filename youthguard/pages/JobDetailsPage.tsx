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

  if (!job) {
    return (
      <div className="text-center py-12 sm:py-16 slide-up">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Job not found</h2>
        <p className="text-text-secondary mt-2">The job you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/jobs')}
          className="btn-primary mt-4 sm:mt-6"
        >
          Browse All Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 fade-in">
      <div className="slide-up">
        <button 
          onClick={() => navigate('/jobs')}
          className="flex items-center text-primary hover:text-blue-700 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </button>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary">
              {job.title}
            </h1>
            <p className="mt-1 sm:mt-2 text-text-secondary text-base sm:text-lg">
              {job.company} • {job.location}
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
              {job.jobType}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-6 slide-up animation-delay-100">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6">
              Job Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-text-secondary text-sm sm:text-base">
                {job.description}
              </p>
            </div>
          </div>

          <div className="card p-4 sm:p-6 slide-up animation-delay-200">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6">
              Requirements
            </h2>
            <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-text-secondary text-sm sm:text-base">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="card p-4 sm:p-6 slide-up animation-delay-300">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="slide-up animation-delay-400">
          <div className="card p-4 sm:p-6 sticky top-4 sm:top-6">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6">
              Job Details
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Location</h3>
                <p className="text-text-secondary mt-1 text-sm">{job.location}</p>
              </div>
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Job Type</h3>
                <p className="text-text-secondary mt-1 text-sm">{job.jobType}</p>
              </div>
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Experience</h3>
                <p className="text-text-secondary mt-1 text-sm">{job.experienceLevel}</p>
              </div>
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Salary Range</h3>
                <p className="text-text-secondary mt-1 text-sm">
                  {job.salaryMin && job.salaryMax 
                    ? `₦${job.salaryMin.toLocaleString()} - ₦${job.salaryMax.toLocaleString()}`
                    : 'Not specified'}
                </p>
              </div>
              <div className="card p-3 sm:p-4">
                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Application Deadline</h3>
                <p className="text-text-secondary mt-1 text-sm">
                  {job.applicationDeadline 
                    ? new Date(job.applicationDeadline).toLocaleDateString() 
                    : 'No deadline specified'}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              {!showApplicationForm ? (
                <button 
                  onClick={() => setShowApplicationForm(true)}
                  className="btn-primary w-full text-sm sm:text-base"
                >
                  Apply for this Job
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1 sm:mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1 sm:mb-2">
                      Resume URL
                    </label>
                    <input
                      type="text"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      placeholder="https://example.com/resume.pdf"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={applying}
                      className="btn-primary flex-1 text-sm sm:text-base"
                    >
                      {applying ? (
                        <span className="flex items-center justify-center">
                          <span className="loading-spinner mr-2 w-3 h-3 sm:w-4 sm:h-4 border-2"></span>
                          <span className="text-xs sm:text-sm">Submitting...</span>
                        </span>
                      ) : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="btn-outline text-sm sm:text-base"
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