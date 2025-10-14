/**
 * Progress Service for YouthGuard MVP
 * 
 * This service handles all business logic related to user progress tracking.
 */

const Progress = require('../models/Progress');

class ProgressService {
    /**
     * Create or update progress
     * @param {Object} progressData - Progress data
     * @returns {Promise<Object>} Created/updated progress
     */
    async updateProgress(progressData) {
        try {
            // Check if progress already exists
            let progress = await Progress.findOne({
                userId: progressData.userId,
                courseId: progressData.courseId,
                lessonId: progressData.lessonId
            });
            
            if (progress) {
                // Update existing progress
                progress = await Progress.findByIdAndUpdate(
                    progress._id,
                    { ...progressData, updatedAt: new Date() },
                    { new: true, runValidators: true }
                );
            } else {
                // Create new progress
                progress = new Progress(progressData);
                progress = await progress.save();
            }
            
            return progress;
        } catch (error) {
            throw new Error(`Failed to update progress: ${error.message}`);
        }
    }

    /**
     * Get progress for user in course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Array>} List of progress records
     */
    async getProgressForCourse(userId, courseId) {
        try {
            const progress = await Progress.find({ userId, courseId });
            return progress;
        } catch (error) {
            throw new Error(`Failed to fetch progress: ${error.message}`);
        }
    }

    /**
     * Get overall progress for user
     * @param {String} userId - User ID
     * @returns {Promise<Array>} List of all progress records
     */
    async getProgressForUser(userId) {
        try {
            const progress = await Progress.find({ userId }).populate('courseId', 'title').populate('lessonId', 'title');
            return progress;
        } catch (error) {
            throw new Error(`Failed to fetch user progress: ${error.message}`);
        }
    }

    /**
     * Calculate completion percentage for course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Number>} Completion percentage
     */
    async getCourseCompletionPercentage(userId, courseId) {
        try {
            const progressRecords = await Progress.find({ userId, courseId });
            const completedCount = progressRecords.filter(p => p.completionStatus === 'Completed').length;
            const totalCount = progressRecords.length;
            
            if (totalCount === 0) return 0;
            
            return Math.round((completedCount / totalCount) * 100);
        } catch (error) {
            throw new Error(`Failed to calculate completion: ${error.message}`);
        }
    }
}

module.exports = ProgressService;
