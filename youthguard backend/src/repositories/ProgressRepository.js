/**
 * Progress Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for Progress documents.
 * It extends the BaseRepository and provides progress-specific functionality
 * such as lesson tracking, quiz management, and learning analytics.
 * 
 * Key Features:
 * - Course progress tracking
 * - Lesson progress management
 * - Quiz and assessment tracking
 * - Learning analytics
 * - Certification management
 * - User progress reporting
 */

const BaseRepository = require('./BaseRepository');
const Progress = require('../models/Progress');
const logger = require('../utils/logger');

/**
 * ProgressRepository Class
 * 
 * Repository for Progress model with specialized operations.
 */
class ProgressRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(Progress);
    }
    
    /**
     * Find progress by user and course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Object|null>} Progress document or null
     */
    async findByUserAndCourse(userId, courseId) {
        try {
            const progress = await this.model.findOne({ userId, courseId });
            return progress;
        } catch (error) {
            logger.error('Error finding progress by user and course', { 
                error: error.message, 
                userId,
                courseId
            });
            throw error;
        }
    }
    
    /**
     * Find progress by user
     * @param {String} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Progress records with pagination
     */
    async findByUser(userId, options = {}) {
        try {
            const result = await this.findMany(
                { userId },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'timeTracking.lastActivityAt': -1 },
                    select: options.select,
                    populate: options.populate || 'courseId'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding progress by user', { 
                error: error.message, 
                userId
            });
            throw error;
        }
    }
    
    /**
     * Find progress by course
     * @param {String} courseId - Course ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Progress records with pagination
     */
    async findByCourse(courseId, options = {}) {
        try {
            const result = await this.findMany(
                { courseId },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'timeTracking.lastActivityAt': -1 },
                    select: options.select,
                    populate: options.populate || 'userId'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding progress by course', { 
                error: error.message, 
                courseId
            });
            throw error;
        }
    }
    
    /**
     * Find progress by status
     * @param {String} status - Progress status
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Progress records with pagination
     */
    async findByStatus(status, options = {}) {
        try {
            const result = await this.findMany(
                { status },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'timeTracking.lastActivityAt': -1 },
                    select: options.select,
                    populate: options.populate || 'userId courseId'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding progress by status', { 
                error: error.message, 
                status
            });
            throw error;
        }
    }
    

    
    /**
     * Record time spent on a lesson
     * @param {String} progressId - Progress ID
     * @param {String} lessonId - Lesson ID
     * @param {Number} minutes - Time spent in minutes
     * @param {String} device - Device used
     * @returns {Promise<Object|null>} Updated progress or null
     */
    async recordTimeSpent(progressId, lessonId, minutes, device = 'web') {
        try {
            const progress = await this.model.findOneAndUpdate(
                { _id: progressId, 'lessons.lessonId': lessonId },
                {
                    $inc: {
                        'lessons.$.timeSpent': minutes,
                        'timeTracking.totalTimeSpent': minutes,
                        'timeTracking.totalSessions': 1
                    },
                    $push: {
                        'lessons.$.sessions': {
                            startTime: new Date(Date.now() - minutes * 60 * 1000),
                            endTime: new Date(),
                            duration: minutes,
                            device: device
                        }
                    },
                    'timeTracking.lastActivityAt': new Date()
                },
                { new: true }
            );
            
            // Update average session duration
            if (progress) {
                const totalTime = progress.timeTracking.totalTimeSpent;
                const totalSessions = progress.timeTracking.totalSessions;
                progress.timeTracking.averageSessionDuration = totalSessions > 0 ? 
                    totalTime / totalSessions : 0;
                
                if (minutes > progress.timeTracking.longestSession) {
                    progress.timeTracking.longestSession = minutes;
                }
                
                await progress.save();
            }
            
            return progress;
        } catch (error) {
            logger.error('Error recording time spent', { 
                error: error.message, 
                progressId,
                lessonId,
                minutes,
                device
            });
            throw error;
        }
    }
    
    /**
     * Submit quiz attempt
     * @param {String} progressId - Progress ID
     * @param {String} lessonId - Lesson ID
     * @param {Object} quizResult - Quiz result data
     * @returns {Promise<Object|null>} Updated progress or null
     */
    async submitQuizAttempt(progressId, lessonId, quizResult) {
        try {
            const progress = await this.model.findOne({ _id: progressId });
            if (!progress) return null;
            
            // Find the lesson progress
            const lessonProgress = progress.lessons.find(l => 
                l.lessonId.toString() === lessonId
            );
            
            if (!lessonProgress) {
                throw new Error('Lesson progress not found');
            }
            
            // Add quiz attempt
            const attempt = {
                attemptNumber: lessonProgress.quiz.totalAttempts + 1,
                completedAt: new Date(),
                score: quizResult.score,
                totalQuestions: quizResult.totalQuestions,
                correctAnswers: quizResult.correctAnswers,
                incorrectAnswers: quizResult.incorrectAnswers,
                timeSpent: quizResult.timeSpent,
                answers: quizResult.answers,
                passed: quizResult.passed
            };
            
            lessonProgress.quiz.attempts.push(attempt);
            lessonProgress.quiz.totalAttempts += 1;
            
            // Update best score
            if (quizResult.score > lessonProgress.quiz.bestScore) {
                lessonProgress.quiz.bestScore = quizResult.score;
            }
            
            // Update passed status
            if (quizResult.passed && !lessonProgress.quiz.passed) {
                lessonProgress.quiz.passed = true;
                lessonProgress.quiz.firstPassedAt = new Date();
                progress.metrics.quizzesPassed += 1;
            }
            
            // Recalculate average quiz score
            await this.calculateAverageQuizScore(progress._id);
            
            await progress.save();
            return progress;
        } catch (error) {
            logger.error('Error submitting quiz attempt', { 
                error: error.message, 
                progressId,
                lessonId,
                quizResult
            });
            throw error;
        }
    }
    
    /**
     * Update progress percentage
     * @param {String} progressId - Progress ID
     * @returns {Promise<Object|null>} Updated progress or null
     */
    async updateProgressPercentage(progressId) {
        try {
            const progress = await this.findById(progressId);
            if (!progress) return null;
            
            if (progress.metrics.totalLessons > 0) {
                progress.percentage = Math.round(
                    (progress.metrics.lessonsCompleted / progress.metrics.totalLessons) * 100
                );
                
                // Update status if completed
                if (progress.percentage === 100 && progress.status !== 'completed') {
                    progress.status = 'completed';
                    progress.completedAt = new Date();
                }
                
                await progress.save();
            }
            
            return progress;
        } catch (error) {
            logger.error('Error updating progress percentage', { 
                error: error.message, 
                progressId
            });
            throw error;
        }
    }
    
    /**
     * Calculate average quiz score for progress
     * @param {String} progressId - Progress ID
     * @returns {Promise<Object|null>} Updated progress or null
     */
    async calculateAverageQuizScore(progressId) {
        try {
            const progress = await this.findById(progressId);
            if (!progress) return null;
            
            const allScores = [];
            
            progress.lessons.forEach(lesson => {
                if (lesson.quiz.bestScore > 0) {
                    allScores.push(lesson.quiz.bestScore);
                }
            });
            
            if (allScores.length > 0) {
                progress.metrics.averageQuizScore = Math.round(
                    allScores.reduce((sum, score) => sum + score, 0) / allScores.length
                );
            }
            
            await progress.save();
            return progress;
        } catch (error) {
            logger.error('Error calculating average quiz score', { 
                error: error.message, 
                progressId
            });
            throw error;
        }
    }
    
    /**
     * Get user learning statistics
     * @param {String} userId - User ID
     * @returns {Promise<Object>} User learning statistics
     */
    async getUserStatistics(userId) {
        try {
            const stats = await this.model.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: null,
                        totalCourses: { $sum: 1 },
                        completedCourses: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        },
                        inProgressCourses: {
                            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
                        },
                        totalTimeSpent: { $sum: '$timeTracking.totalTimeSpent' },
                        averageProgress: { $avg: '$percentage' },
                        certificatesEarned: {
                            $sum: { $cond: ['$certification.earned', 1, 0] }
                        },
                        longestStreak: { $max: '$timeTracking.streakDays.longest' },
                        skillsAcquired: { $sum: { $size: '$metrics.skillsAcquired' } }
                    }
                }
            ]);
            
            return stats[0] || { 
                totalCourses: 0,
                completedCourses: 0,
                inProgressCourses: 0,
                totalTimeSpent: 0,
                averageProgress: 0,
                certificatesEarned: 0,
                longestStreak: 0,
                skillsAcquired: 0
            };
        } catch (error) {
            logger.error('Error getting user learning statistics', { 
                error: error.message,
                userId
            });
            throw error;
        }
    }
    
    /**
     * Get course progress statistics
     * @param {String} courseId - Course ID
     * @returns {Promise<Object>} Course progress statistics
     */
    async getCourseStatistics(courseId) {
        try {
            const stats = await this.model.aggregate([
                { $match: { courseId: courseId } },
                {
                    $group: {
                        _id: null,
                        totalEnrolled: { $sum: 1 },
                        completed: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        },
                        inProgress: {
                            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
                        },
                        dropped: {
                            $sum: { $cond: [{ $eq: ['$status', 'dropped'] }, 1, 0] }
                        },
                        averageProgress: { $avg: '$percentage' },
                        averageTimeSpent: { $avg: '$timeTracking.totalTimeSpent' },
                        averageRating: { $avg: '$feedback.courseRating.overall' }
                    }
                }
            ]);
            
            return stats[0] || { 
                totalEnrolled: 0,
                completed: 0,
                inProgress: 0,
                dropped: 0,
                averageProgress: 0,
                averageTimeSpent: 0,
                averageRating: 0
            };
        } catch (error) {
            logger.error('Error getting course progress statistics', { 
                error: error.message,
                courseId
            });
            throw error;
        }
    }
    
    /**
     * Find users who need encouragement (inactive for a while)
     * @param {Number} daysInactive - Number of days of inactivity
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Inactive progress records with pagination
     */
    async findInactiveUsers(daysInactive = 7, options = {}) {
        try {
            const cutoffDate = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000);
            
            const result = await this.findMany(
                {
                    status: 'in_progress',
                    'timeTracking.lastActivityAt': { $lt: cutoffDate }
                },
                {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { 'timeTracking.lastActivityAt': 1 },
                    select: options.select,
                    populate: options.populate || 'userId courseId'
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error finding inactive users', { 
                error: error.message,
                daysInactive
            });
            throw error;
        }
    }
    
    /**
     * Add a note to a lesson
     * @param {String} progressId - Progress ID
     * @param {String} lessonId - Lesson ID
     * @param {String} content - Note content
     * @param {Number} timestamp - Position in lesson
     * @returns {Promise<Object|null>} Updated progress or null
     */
    async addNote(progressId, lessonId, content, timestamp = 0) {
        try {
            const progress = await this.model.findOneAndUpdate(
                { _id: progressId, 'lessons.lessonId': lessonId },
                {
                    $push: {
                        'lessons.$.notes': {
                            content: content,
                            timestamp: timestamp,
                            createdAt: new Date()
                        }
                    },
                    $inc: { 'analytics.engagement.notesCount': 1 }
                },
                { new: true }
            );
            
            return progress;
        } catch (error) {
            logger.error('Error adding note to lesson', { 
                error: error.message, 
                progressId,
                lessonId,
                content,
                timestamp
            });
            throw error;
        }
    }
    
    /**
     * Update learning streak
     * @param {String} progressId - Progress ID
     * @returns {Promise<Object|null>} Updated progress or null
     */
    async updateLearningStreak(progressId) {
        try {
            const progress = await this.findById(progressId);
            if (!progress) return null;
            
            const today = new Date().toDateString();
            const lastActivity = progress.timeTracking.streakDays.lastActivityDate;
            
            if (!lastActivity || lastActivity.toDateString() !== today) {
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
                
                if (lastActivity && lastActivity.toDateString() === yesterday) {
                    // Continue streak
                    progress.timeTracking.streakDays.current += 1;
                } else {
                    // Start new streak
                    progress.timeTracking.streakDays.current = 1;
                }
                
                // Update longest streak
                if (progress.timeTracking.streakDays.current > progress.timeTracking.streakDays.longest) {
                    progress.timeTracking.streakDays.longest = progress.timeTracking.streakDays.current;
                }
                
                progress.timeTracking.streakDays.lastActivityDate = new Date();
                await progress.save();
            }
            
            return progress;
        } catch (error) {
            logger.error('Error updating learning streak', { 
                error: error.message, 
                progressId
            });
            throw error;
        }
    }
}

module.exports = ProgressRepository;