/**
 * Job Controller for YouthGuard MVP
 * 
 * This controller handles all HTTP requests related to jobs and applications.
 */

const JobService = require('../services/JobService');

class JobController {
    constructor() {
        this.jobService = new JobService();
    }

    /**
     * Create a new job
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async createJob(req, res) {
        try {
            const job = await this.jobService.createJob(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Job created successfully',
                data: job
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all jobs
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAllJobs(req, res) {
        try {
            const jobs = await this.jobService.getAllJobs();
            
            res.status(200).json({
                success: true,
                message: 'Jobs retrieved successfully',
                data: jobs
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get job by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await this.jobService.getJobById(id);
            
            res.status(200).json({
                success: true,
                message: 'Job retrieved successfully',
                data: job
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update job
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateJob(req, res) {
        try {
            const { id } = req.params;
            const job = await this.jobService.updateJob(id, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Job updated successfully',
                data: job
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete job
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteJob(req, res) {
        try {
            const { id } = req.params;
            await this.jobService.deleteJob(id);
            
            res.status(200).json({
                success: true,
                message: 'Job deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Apply for job
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async applyForJob(req, res) {
        try {
            const application = await this.jobService.applyForJob(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: application
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get applications for job
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getApplicationsForJob(req, res) {
        try {
            const { jobId } = req.params;
            const applications = await this.jobService.getApplicationsForJob(jobId);
            
            res.status(200).json({
                success: true,
                message: 'Applications retrieved successfully',
                data: applications
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get applications for user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getApplicationsForUser(req, res) {
        try {
            const { userId } = req.params;
            const applications = await this.jobService.getApplicationsForUser(userId);
            
            res.status(200).json({
                success: true,
                message: 'Applications retrieved successfully',
                data: applications
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new JobController();
