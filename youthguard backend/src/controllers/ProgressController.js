/**
 * Progress Controller for YouthGuard MVP
 * 
 * This controller handles all HTTP requests related to user progress tracking.
 */

const ProgressService = require('../services/ProgressService');

class ProgressController {
    constructor() {
        this.progressService = new ProgressService();
    }

    /**
     * Update progress
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateProgress(req, res) {
        try {
            const progress = await this.progressService.updateProgress(req.body);
            
            res.status(200).json({
                success: true,
                message: 'Progress updated successfully',
                data: progress
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get progress for course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getProgressForCourse(req, res) {
        try {
            const { userId, courseId } = req.params;
            const progress = await this.progressService.getProgressForCourse(userId, courseId);
            
            res.status(200).json({
                success: true,
                message: 'Progress retrieved successfully',
                data: progress
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get progress for user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getProgressForUser(req, res) {
        try {
            const { userId } = req.params;
            const progress = await this.progressService.getProgressForUser(userId);
            
            res.status(200).json({
                success: true,
                message: 'Progress retrieved successfully',
                data: progress
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get course completion percentage
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCourseCompletion(req, res) {
        try {
            const { userId, courseId } = req.params;
            const percentage = await this.progressService.getCourseCompletionPercentage(userId, courseId);
            
            res.status(200).json({
                success: true,
                message: 'Completion percentage calculated successfully',
                data: { percentage }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ProgressController();