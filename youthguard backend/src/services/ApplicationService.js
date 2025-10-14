/**
 * Application Service - YouthGuard Platform
 * 
 * This service handles all business logic related to Job Applications.
 * It extends the BaseService and provides application-specific functionality
 * such as application submission, status management, and interview scheduling.
 * 
 * Key Features:
 * - Application submission and tracking
 * - Status management and workflow
 * - Interview scheduling and management
 * - Communication between applicants and employers
 * - Application analytics and reporting
 */

const BaseService = require('./BaseService');
const ApplicationRepository = require('../repositories/ApplicationRepository');
const logger = require('../utils/logger');

/**
 * ApplicationService Class
 * 
 * Service for Application model with specialized business logic.
 */
class ApplicationService extends BaseService {
    /**
     * Constructor
     */
    constructor() {
        super(new ApplicationRepository());
    }
    
    /**
     * Submit a new application
     * @param {Object} applicationData - Application data
     * @returns {Promise<Object>} Created application
     */
    async submitApplication(applicationData) {
        try {
            logger.info('Submitting new application', { 
                jobId: applicationData.job, 
                applicantId: applicationData.applicant 
            });
            
            // Check for duplicate application
            const existingApplication = await this.repository.findDuplicate(
                applicationData.applicant, 
                applicationData.job
            );
            
            if (existingApplication) {
                throw new Error('Application already exists for this job');
            }
            
            // Prepare application data
            const application = {
                applicant: applicationData.applicant,
                job: applicationData.job,
                employer: applicationData.employer,
                status: {
                    current: 'submitted',
                    history: [{
                        status: 'submitted',
                        changedAt: new Date(),
                        changedBy: applicationData.applicant
                    }],
                    lastUpdated: new Date()
                },
                documents: applicationData.documents,
                content: applicationData.content,
                metadata: {
                    source: applicationData.metadata?.source || 'platform',
                    applicationMethod: applicationData.metadata?.applicationMethod || 'detailed_form',
                    timeToComplete: applicationData.metadata?.timeToComplete || 0,
                    deviceUsed: applicationData.metadata?.deviceUsed || 'desktop'
                }
            };
            
            // Create application through repository
            const createdApplication = await this.repository.create(application);
            
            logger.info('Application submitted successfully', { applicationId: createdApplication._id });
            return createdApplication;
            
        } catch (error) {
            logger.error('Error submitting application', { 
                error: error.message, 
                jobId: applicationData.job,
                applicantId: applicationData.applicant
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
     * @returns {Promise<Object>} Updated application
     */
    async updateStatus(applicationId, newStatus, changedBy, note = '') {
        try {
            logger.info('Updating application status', { 
                applicationId, 
                newStatus, 
                changedBy 
            });
            
            const application = await this.repository.updateStatus(
                applicationId, 
                newStatus, 
                changedBy, 
                note
            );
            
            logger.info('Application status updated successfully', { applicationId, newStatus });
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
     * Schedule an interview
     * @param {String} applicationId - Application ID
     * @param {Object} interviewData - Interview data
     * @returns {Promise<Object>} Updated application
     */
    async scheduleInterview(applicationId, interviewData) {
        try {
            logger.info('Scheduling interview', { applicationId });
            
            const application = await this.repository.scheduleInterview(applicationId, interviewData);
            
            // Update application status to interview
            if (application && application.status.current !== 'interview') {
                await this.repository.updateStatus(
                    applicationId, 
                    'interview', 
                    interviewData.interviewer?.user || 'system',
                    'Interview scheduled'
                );
            }
            
            logger.info('Interview scheduled successfully', { applicationId });
            return application;
            
        } catch (error) {
            logger.error('Error scheduling interview', { 
                error: error.message, 
                applicationId
            });
            throw error;
        }
    }
    
    /**
     * Add communication to application
     * @param {String} applicationId - Application ID
     * @param {Object} communicationData - Communication data
     * @returns {Promise<Object>} Updated application
     */
    async addCommunication(applicationId, communicationData) {
        try {
            logger.info('Adding communication to application', { applicationId });
            
            const application = await this.repository.addCommunication(applicationId, communicationData);
            
            logger.info('Communication added to application successfully', { applicationId });
            return application;
            
        } catch (error) {
            logger.error('Error adding communication to application', { 
                error: error.message, 
                applicationId
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
            logger.info('Marking communications as read', { applicationId, userId });
            
            const count = await this.repository.markCommunicationsAsRead(applicationId, userId);
            
            logger.info('Communications marked as read successfully', { 
                applicationId, 
                userId, 
                count 
            });
            return count;
            
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
     * Search applications
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results
     */
    async searchApplications(searchText, options = {}) {
        try {
            logger.info('Searching applications', { searchText });
            
            const result = await this.repository.searchApplications(searchText, options);
            
            logger.info('Applications search completed', { 
                searchText, 
                count: result.documents.length 
            });
            
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
     * Find applications by criteria
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications
     */
    async findByCriteria(criteria, options = {}) {
        try {
            logger.info('Finding applications by criteria', { criteria });
            
            const result = await this.repository.findMany(criteria, options);
            
            logger.info('Applications search by criteria completed', { 
                criteria, 
                count: result.documents.length 
            });
            
            return result;
            
        } catch (error) {
            logger.error('Error finding applications by criteria', { 
                error: error.message, 
                criteria 
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
            logger.info('Getting application statistics');
            
            const stats = await this.repository.getStatistics(filters);
            
            logger.info('Application statistics retrieved');
            return stats;
            
        } catch (error) {
            logger.error('Error getting application statistics', { 
                error: error.message,
                filters
            });
            throw error;
        }
    }
    
    /**
     * Get employer analytics
     * @param {String} employerId - Employer ID
     * @param {Object} dateRange - Date range for analytics
     * @returns {Promise<Object>} Analytics data
     */
    async getEmployerAnalytics(employerId, dateRange = {}) {
        try {
            logger.info('Getting employer application analytics', { employerId });
            
            const analytics = await this.repository.getEmployerAnalytics(employerId, dateRange);
            
            logger.info('Employer application analytics retrieved', { employerId });
            return analytics;
            
        } catch (error) {
            logger.error('Error getting employer application analytics', { 
                error: error.message,
                employerId
            });
            throw error;
        }
    }
    
    /**
     * Find pending follow-up applications
     * @param {Number} days - Days since last activity
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications requiring follow-up
     */
    async findPendingFollowUp(days = 7, options = {}) {
        try {
            logger.info('Finding applications requiring follow-up', { days });
            
            const result = await this.repository.findPendingFollowUp(days, options);
            
            logger.info('Pending follow-up applications search completed', { 
                days,
                count: result.documents.length 
            });
            
            return result;
            
        } catch (error) {
            logger.error('Error finding pending follow-up applications', { 
                error: error.message,
                days
            });
            throw error;
        }
    }
    
    /**
     * Find upcoming interviews
     * @param {Number} days - Days until interview
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Applications with upcoming interviews
     */
    async findUpcomingInterviews(days = 7, options = {}) {
        try {
            logger.info('Finding applications with upcoming interviews', { days });
            
            const result = await this.repository.findUpcomingInterviews(days, options);
            
            logger.info('Upcoming interviews search completed', { 
                days,
                count: result.documents.length 
            });
            
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
     * Transform application entity for output
     * @protected
     * @param {Object} application - Application entity
     * @returns {Promise<Object>} Transformed application
     */
    async _transformEntity(application) {
        // Remove sensitive information if any
        const transformedApplication = { ...application.toObject() };
        delete transformedApplication.__v;
        
        return transformedApplication;
    }
}

module.exports = ApplicationService;