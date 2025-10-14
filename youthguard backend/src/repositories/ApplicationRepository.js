/**
 * Application Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for Application documents.
 * It extends the BaseRepository and provides application-specific functionality
 * such as status management, interview scheduling, and communication tracking.
 * 
 * Key Features:
 * - Application status management
 * - Interview scheduling and tracking
 * - Communication management
 * - Application analytics
 * - Employer application management
 * - Candidate application tracking
 */

const BaseRepository = require('./BaseRepository');
const Application = require('../models/Application');
const logger = require('../utils/logger');

/**
 * ApplicationRepository Class
 * 
 * Repository for Application model with specialized operations.
 */
class ApplicationRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(Application);
    }
    
    /**
     * Find applications by applicant
     * @param {String} applicantId - Applicant user ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with pagination
     */
    async findByApplicant(applicantId, options = {}) {
        try {
            const result = await this.findMany(
                { applicant: applicantId },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'job employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding applications by applicant', { 
                error: error.message, 
                applicantId 
            });
            throw error;
        }
    }
    
    /**
     * Find applications by job
     * @param {String} jobId - Job ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with pagination
     */
    async findByJob(jobId, options = {}) {
        try {
            const result = await this.findMany(
                { job: jobId },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'applicant'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding applications by job', { 
                error: error.message, 
                jobId 
            });
            throw error;
        }
    }
    
    /**
     * Find applications by employer
     * @param {String} employerId - Employer user ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with pagination
     */
    async findByEmployer(employerId, options = {}) {
        try {
            const result = await this.findMany(
                { employer: employerId },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'applicant job'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding applications by employer', { 
                error: error.message, 
                employerId 
            });
            throw error;
        }
    }
    
    /**
     * Find applications by status
     * @param {String} status - Application status
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with pagination
     */
    async findByStatus(status, options = {}) {
        try {
            const result = await this.findMany(
                { 'status.current': status },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'status.lastUpdated': -1 },
                    select: options.select,
                    populate: options.populate || 'applicant job employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding applications by status', { 
                error: error.message, 
                status 
            });
            throw error;
        }
    }
    
    /**
     * Find applications within date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with pagination
     */
    async findByDateRange(startDate, endDate, options = {}) {
        try {
            const result = await this.findMany(
                { 
                    createdAt: { 
                        $gte: startDate, 
                        $lte: endDate 
                    }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding applications by date range', { 
                error: error.message, 
                startDate,
                endDate
            });
            throw error;
        }
    }
    
    /**
     * Search applications by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchApplications(searchText, options = {}) {
        try {
            const searchCriteria = {
                $text: { $search: searchText },
                ...options.criteria
            };
            
            const result = await this.findMany(
                searchCriteria,
                {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { score: { $meta: 'textScore' } },
                    select: options.select,
                    populate: options.populate || 'applicant job employer'
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error searching applications', { 
                error: error.message, 
                searchText 
            });
            throw error;
        }
    }
    
    /**
     * Update application status
     * @param {String} applicationId - Application ID
     * @param {String} newStatus - New status
     * @param {String} changedBy - User ID who changed the status
     * @param {String} note - Optional note
     * @returns {Promise<Object|null>} Updated application or null
     */
    async updateStatus(applicationId, newStatus, changedBy, note = '') {
        try {
            const application = await this.model.findByIdAndUpdate(
                applicationId,
                {
                    'status.current': newStatus,
                    'status.lastUpdated': new Date(),
                    $push: {
                        'status.history': {
                            status: newStatus,
                            changedAt: new Date(),
                            changedBy: changedBy,
                            note: note
                        }
                    }
                },
                { new: true }
            );
            return application;
        } catch (error) {
            logger.error('Error updating application status', { 
                error: error.message, 
                applicationId,
                newStatus,
                changedBy
            });
            throw error;
        }
    }
    
    /**
     * Schedule an interview for an application
     * @param {String} applicationId - Application ID
     * @param {Object} interviewData - Interview data
     * @returns {Promise<Object|null>} Updated application or null
     */
    async scheduleInterview(applicationId, interviewData) {
        try {
            const application = await this.model.findByIdAndUpdate(
                applicationId,
                { 
                    $push: { interviews: interviewData },
                    'status.current': 'interview'
                },
                { new: true }
            );
            return application;
        } catch (error) {
            logger.error('Error scheduling interview', { 
                error: error.message, 
                applicationId,
                interviewData
            });
            throw error;
        }
    }
    
    /**
     * Add communication to application
     * @param {String} applicationId - Application ID
     * @param {Object} communicationData - Communication data
     * @returns {Promise<Object|null>} Updated application or null
     */
    async addCommunication(applicationId, communicationData) {
        try {
            const application = await this.model.findByIdAndUpdate(
                applicationId,
                { $push: { communications: communicationData } },
                { new: true }
            );
            return application;
        } catch (error) {
            logger.error('Error adding communication to application', { 
                error: error.message, 
                applicationId,
                communicationData
            });
            throw error;
        }
    }
    
    /**
     * Mark communications as read
     * @param {String} applicationId - Application ID
     * @param {String} userId - User ID marking as read
     * @returns {Promise<Number>} Number of messages marked as read
     */
    async markCommunicationsAsRead(applicationId, userId) {
        try {
            const application = await this.findById(applicationId);
            if (!application) return 0;
            
            let markedCount = 0;
            
            application.communications.forEach(message => {
                if (message.to.toString() === userId && !message.readAt) {
                    message.readAt = new Date();
                    markedCount++;
                }
            });
            
            if (markedCount > 0) {
                await application.save();
            }
            
            return markedCount;
        } catch (error) {
            logger.error('Error marking communications as read', { 
                error: error.message, 
                applicationId,
                userId
            });
            throw error;
        }
    }
    
    /**
     * Get application statistics
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} Application statistics
     */
    async getStatistics(filters = {}) {
        try {
            const matchStage = { ...filters };
            
            const stats = await this.model.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        byStatus: {
                            $push: '$status.current'
                        },
                        byJob: {
                            $push: '$job'
                        },
                        averageDaysInProcess: {
                            $avg: '$analytics.daysInProcess'
                        },
                        totalInterviews: {
                            $sum: { $size: '$interviews' }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        byStatus: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byStatus'] },
                                    as: 'status',
                                    in: {
                                        k: '$$status',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byStatus',
                                                    cond: { $eq: ['$$this', '$$status'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byJob: {
                            $size: { $setUnion: ['$byJob'] }
                        },
                        averageDaysInProcess: { $round: ['$averageDaysInProcess', 2] },
                        totalInterviews: 1
                    }
                }
            ]);
            
            return stats[0] || { 
                total: 0, 
                byStatus: {}, 
                byJob: 0,
                averageDaysInProcess: 0,
                totalInterviews: 0
            };
        } catch (error) {
            logger.error('Error getting application statistics', { 
                error: error.message,
                filters
            });
            throw error;
        }
    }
    
    /**
     * Find applications requiring follow-up
     * @param {Number} days - Days since last activity
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with pagination
     */
    async findPendingFollowUp(days = 7, options = {}) {
        try {
            const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            
            const result = await this.findMany(
                { 
                    'status.current': { 
                        $in: ['submitted', 'under_review', 'shortlisted'] 
                    },
                    'status.lastUpdated': { $lt: cutoffDate }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { 'status.lastUpdated': 1 },
                    select: options.select,
                    populate: options.populate || 'applicant job employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding applications requiring follow-up', { 
                error: error.message,
                days
            });
            throw error;
        }
    }
    
    /**
     * Find applications with upcoming interviews
     * @param {Number} days - Days until interview
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with pagination
     */
    async findUpcomingInterviews(days = 7, options = {}) {
        try {
            const startDate = new Date();
            const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            
            const result = await this.findMany(
                { 
                    'interviews.scheduledAt': { 
                        $gte: startDate, 
                        $lte: endDate 
                    },
                    'interviews.status': 'scheduled'
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { 'interviews.scheduledAt': 1 },
                    select: options.select,
                    populate: options.populate || 'applicant job employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding applications with upcoming interviews', { 
                error: error.message,
                days
            });
            throw error;
        }
    }
    
    /**
     * Find duplicate applications
     * @param {String} applicantId - Applicant ID
     * @param {String} jobId - Job ID
     * @returns {Promise<Object|null>} Existing application or null
     */
    async findDuplicate(applicantId, jobId) {
        try {
            const application = await this.model.findOne({
                applicant: applicantId,
                job: jobId
            });
            return application;
        } catch (error) {
            logger.error('Error finding duplicate application', { 
                error: error.message,
                applicantId,
                jobId
            });
            throw error;
        }
    }
    
    /**
     * Get employer's application analytics
     * @param {String} employerId - Employer ID
     * @param {Object} dateRange - Date range for analytics
     * @returns {Promise<Object>} Analytics data
     */
    async getEmployerAnalytics(employerId, dateRange = {}) {
        try {
            const matchStage = { employer: employerId };
            
            if (dateRange.from || dateRange.to) {
                matchStage.createdAt = {};
                if (dateRange.from) matchStage.createdAt.$gte = new Date(dateRange.from);
                if (dateRange.to) matchStage.createdAt.$lte = new Date(dateRange.to);
            }
            
            const analytics = await this.model.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$status.current',
                        count: { $sum: 1 },
                        avgDaysInProcess: { $avg: '$analytics.daysInProcess' }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$count' },
                        statusBreakdown: {
                            $push: {
                                status: '$_id',
                                count: '$count',
                                avgDaysInProcess: '$avgDaysInProcess'
                            }
                        }
                    }
                }
            ]);
            
            return analytics[0] || { total: 0, statusBreakdown: [] };
        } catch (error) {
            logger.error('Error getting employer application analytics', { 
                error: error.message,
                employerId,
                dateRange
            });
            throw error;
        }
    }
}

module.exports = ApplicationRepository;