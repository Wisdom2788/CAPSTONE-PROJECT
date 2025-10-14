/**
 * Job Service for YouthGuard MVP
 * 
 * This service handles all business logic related to jobs and applications.
 */

const Job = require('../models/Job');
const Application = require('../models/Application');

class JobService {
    /**
     * Create a new job
     * @param {Object} jobData - Job data
     * @returns {Promise<Object>} Created job
     */
    async createJob(jobData) {
        try {
            const job = new Job(jobData);
            const savedJob = await job.save();
            return savedJob;
        } catch (error) {
            throw new Error(`Failed to create job: ${error.message}`);
        }
    }

    /**
     * Get all active jobs
     * @returns {Promise<Array>} List of jobs
     */
    async getAllJobs() {
        try {
            const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
            return jobs;
        } catch (error) {
            throw new Error(`Failed to fetch jobs: ${error.message}`);
        }
    }

    /**
     * Get job by ID
     * @param {String} jobId - Job ID
     * @returns {Promise<Object>} Job data
     */
    async getJobById(jobId) {
        try {
            const job = await Job.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            return job;
        } catch (error) {
            throw new Error(`Failed to fetch job: ${error.message}`);
        }
    }

    /**
     * Update job
     * @param {String} jobId - Job ID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated job
     */
    async updateJob(jobId, updateData) {
        try {
            const job = await Job.findByIdAndUpdate(
                jobId,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
            
            if (!job) {
                throw new Error('Job not found');
            }
            
            return job;
        } catch (error) {
            throw new Error(`Failed to update job: ${error.message}`);
        }
    }

    /**
     * Delete job
     * @param {String} jobId - Job ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteJob(jobId) {
        try {
            const job = await Job.findByIdAndUpdate(
                jobId,
                { isActive: false, updatedAt: new Date() },
                { new: true }
            );
            
            if (!job) {
                throw new Error('Job not found');
            }
            
            return true;
        } catch (error) {
            throw new Error(`Failed to delete job: ${error.message}`);
        }
    }

    /**
     * Apply for job
     * @param {Object} applicationData - Application data
     * @returns {Promise<Object>} Created application
     */
    async applyForJob(applicationData) {
        try {
            // Check if user already applied
            const existingApplication = await Application.findOne({
                jobId: applicationData.jobId,
                applicantId: applicationData.applicantId
            });
            
            if (existingApplication) {
                throw new Error('You have already applied for this job');
            }

            // Create application
            const application = new Application(applicationData);
            const savedApplication = await application.save();
            
            // Update job application count
            await Job.findByIdAndUpdate(applicationData.jobId, {
                $inc: { applicationsCount: 1 }
            });
            
            return savedApplication;
        } catch (error) {
            throw new Error(`Failed to apply for job: ${error.message}`);
        }
    }

    /**
     * Get applications for job
     * @param {String} jobId - Job ID
     * @returns {Promise<Array>} List of applications
     */
    async getApplicationsForJob(jobId) {
        try {
            const applications = await Application.find({ jobId }).populate('applicantId', 'firstName lastName email');
            return applications;
        } catch (error) {
            throw new Error(`Failed to fetch applications: ${error.message}`);
        }
    }

    /**
     * Get applications for user
     * @param {String} userId - User ID
     * @returns {Promise<Array>} List of applications
     */
    async getApplicationsForUser(userId) {
        try {
            const applications = await Application.find({ applicantId: userId }).populate('jobId', 'title company');
            return applications;
        } catch (error) {
            throw new Error(`Failed to fetch user applications: ${error.message}`);
        }
    }
}

module.exports = JobService;
