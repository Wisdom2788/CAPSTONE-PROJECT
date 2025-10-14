/**
 * Application Controller - YouthGuard Platform
 * 
 * This controller handles all HTTP requests related to Job Applications.
 * It extends the BaseController and provides application-specific API endpoints
 * for application submission, status management, and interview scheduling.
 * 
 * Key Features:
 * - Application submission and tracking
 * - Status management and workflow
 * - Interview scheduling and management
 * - Communication between applicants and employers
 * - Application analytics and reporting
 */

const BaseController = require('./BaseController');
const ApplicationService = require('../services/ApplicationService');
const logger = require('../utils/logger');

/**
 * ApplicationController Class
 * 
 * Controller for Application model with specialized API endpoints.
 */
class ApplicationController extends BaseController {
    /**
     * Constructor
     */
    constructor() {
        super(new ApplicationService());
    }
    
    /**
     * Submit a new application
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async submitApplication(req, res, next) {
        try {
            logger.info('Submitting new application', { applicantId: req.user.id });
            
            // Validate request data
            const validationError = this._validateApplicationRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Add applicant ID to application data
            const applicationData = {
                ...req.body,
                applicant: req.user.id
            };
            
            // Submit application through service
            const application = await this.service.submitApplication(applicationData);
            
            logger.info('Application submitted successfully', { applicationId: application._id });
            
            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: application
            });
            
        } catch (error) {
            logger.error('Error submitting application', { 
                error: error.message,
                applicantId: req.user.id,
                stack: error.stack
            });
            
            // Handle duplicate application error
            if (error.message === 'Application already exists for this job') {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get application by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getApplication(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Getting application by ID', { applicationId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid application ID format'
                });
            }
            
            // Get application through service
            const application = await this.service.findById(id);
            
            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found'
                });
            }
            
            // Check if user is authorized to view this application
            if (!this._canViewApplication(application, req.user)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied to this application'
                });
            }
            
            logger.info('Application retrieved successfully', { applicationId: id });
            
            res.status(200).json({
                success: true,
                message: 'Application retrieved successfully',
                data: application
            });
            
        } catch (error) {
            logger.error('Error getting application', { 
                error: error.message,
                applicationId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Update application status
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status, note } = req.body;
            
            logger.info('Updating application status', { applicationId: id, status });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid application ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateStatusUpdateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Check if user is authorized to update this application
            const existingApplication = await this.service.findById(id);
            if (!existingApplication) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found'
                });
            }
            
            if (!this._canUpdateApplication(existingApplication, req.user)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not authorized to update this application.'
                });
            }
            
            // Update status through service
            const application = await this.service.updateStatus(id, status, req.user.id, note);
            
            logger.info('Application status updated successfully', { applicationId: id, status });
            
            res.status(200).json({
                success: true,
                message: 'Application status updated successfully',
                data: application
            });
            
        } catch (error) {
            logger.error('Error updating application status', { 
                error: error.message,
                applicationId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Schedule an interview
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async scheduleInterview(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Scheduling interview', { applicationId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid application ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateInterviewRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Check if user is authorized to schedule interview for this application
            const existingApplication = await this.service.findById(id);
            if (!existingApplication) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found'
                });
            }
            
            if (!this._canUpdateApplication(existingApplication, req.user)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not authorized to schedule interviews for this application.'
                });
            }
            
            // Add interviewer information
            const interviewData = {
                ...req.body,
                interviewer: {
                    ...req.body.interviewer,
                    user: req.user.id
                }
            };
            
            // Schedule interview through service
            const application = await this.service.scheduleInterview(id, interviewData);
            
            logger.info('Interview scheduled successfully', { applicationId: id });
            
            res.status(200).json({
                success: true,
                message: 'Interview scheduled successfully',
                data: application
            });
            
        } catch (error) {
            logger.error('Error scheduling interview', { 
                error: error.message,
                applicationId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Add communication to application
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async addCommunication(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Adding communication to application', { applicationId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid application ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateCommunicationRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Check if user is authorized to communicate on this application
            const existingApplication = await this.service.findById(id);
            if (!existingApplication) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found'
                });
            }
            
            if (!this._canCommunicateOnApplication(existingApplication, req.user)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not authorized to communicate on this application.'
                });
            }
            
            // Add sender information
            const communicationData = {
                ...req.body,
                from: req.user.id
            };
            
            // Add communication through service
            const application = await this.service.addCommunication(id, communicationData);
            
            logger.info('Communication added to application successfully', { applicationId: id });
            
            res.status(200).json({
                success: true,
                message: 'Communication added successfully',
                data: application
            });
            
        } catch (error) {
            logger.error('Error adding communication to application', { 
                error: error.message,
                applicationId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Mark communications as read
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async markCommunicationsAsRead(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Marking communications as read', { applicationId: id, userId: req.user.id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid application ID format'
                });
            }
            
            // Mark communications as read through service
            const count = await this.service.markCommunicationsAsRead(id, req.user.id);
            
            logger.info('Communications marked as read successfully', { 
                applicationId: id, 
                userId: req.user.id, 
                count 
            });
            
            res.status(200).json({
                success: true,
                message: `${count} communications marked as read`,
                data: { count }
            });
            
        } catch (error) {
            logger.error('Error marking communications as read', { 
                error: error.message,
                applicationId: req.params.id,
                userId: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Search applications
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async searchApplications(req, res, next) {
        try {
            logger.info('Searching applications', { 
                query: req.query.q,
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Parse query parameters
            const searchText = req.query.q || '';
            const options = this._parseOptions(req.query);
            
            // Search applications through service
            const result = await this.service.searchApplications(searchText, options);
            
            logger.info('Applications search completed', { count: result.documents.length });
            
            res.status(200).json({
                success: true,
                message: 'Applications search completed',
                data: result.documents,
                pagination: result.pagination
            });
            
        } catch (error) {
            logger.error('Error searching applications', { 
                error: error.message,
                query: req.query.q,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get applications by criteria
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getApplicationsByCriteria(req, res, next) {
        try {
            logger.info('Getting applications by criteria', { 
                criteria: this._sanitizeLogData(req.query),
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Parse query parameters
            const criteria = this._parseCriteria(req.query);
            const options = this._parseOptions(req.query);
            
            // Get applications through service
            const result = await this.service.findByCriteria(criteria, options);
            
            logger.info('Applications retrieved by criteria', { count: result.documents.length });
            
            res.status(200).json({
                success: true,
                message: 'Applications retrieved successfully',
                data: result.documents,
                pagination: result.pagination
            });
            
        } catch (error) {
            logger.error('Error getting applications by criteria', { 
                error: error.message,
                criteria: this._sanitizeLogData(req.query),
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get application statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getStatistics(req, res, next) {
        try {
            logger.info('Getting application statistics', { 
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Get statistics through service
            const stats = await this.service.getStatistics();
            
            logger.info('Application statistics retrieved');
            
            res.status(200).json({
                success: true,
                message: 'Application statistics retrieved',
                data: stats
            });
            
        } catch (error) {
            logger.error('Error getting application statistics', { 
                error: error.message,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Check if user can view application
     * @protected
     * @param {Object} application - Application object
     * @param {Object} user - User object
     * @returns {Boolean} Whether user can view application
     */
    _canViewApplication(application, user) {
        if (!user) return false;
        
        // Applicant and employer can view
        return application.applicant.toString() === user.id || 
               application.employer.toString() === user.id;
    }
    
    /**
     * Check if user can update application
     * @protected
     * @param {Object} application - Application object
     * @param {Object} user - User object
     * @returns {Boolean} Whether user can update application
     */
    _canUpdateApplication(application, user) {
        if (!user) return false;
        
        // Only employer can update status
        return application.employer.toString() === user.id;
    }
    
    /**
     * Check if user can communicate on application
     * @protected
     * @param {Object} application - Application object
     * @param {Object} user - User object
     * @returns {Boolean} Whether user can communicate
     */
    _canCommunicateOnApplication(application, user) {
        if (!user) return false;
        
        // Applicant and employer can communicate
        return application.applicant.toString() === user.id || 
               application.employer.toString() === user.id;
    }
    
    /**
     * Validate application request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateApplicationRequest(req) {
        const { job, content } = req.body;
        
        if (!job) {
            return 'Job ID is required';
        }
        
        if (!content) {
            return 'Application content is required';
        }
        
        if (!content.coverLetterText || content.coverLetterText.trim().length === 0) {
            return 'Cover letter is required';
        }
        
        return null;
    }
    
    /**
     * Validate status update request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateStatusUpdateRequest(req) {
        const { status } = req.body;
        
        if (!status) {
            return 'Status is required';
        }
        
        const validStatuses = [
            'submitted', 'under_review', 'shortlisted', 'interview', 
            'final_review', 'offered', 'accepted', 'rejected', 'withdrawn'
        ];
        
        if (!validStatuses.includes(status)) {
            return 'Invalid status';
        }
        
        return null;
    }
    
    /**
     * Validate interview request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateInterviewRequest(req) {
        const { type, scheduledAt, location, interviewer } = req.body;
        
        if (!type) {
            return 'Interview type is required';
        }
        
        if (!scheduledAt) {
            return 'Scheduled date and time are required';
        }
        
        if (!location || !location.type) {
            return 'Location type is required';
        }
        
        if (!interviewer || !interviewer.name) {
            return 'Interviewer name is required';
        }
        
        return null;
    }
    
    /**
     * Validate communication request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateCommunicationRequest(req) {
        const { to, subject, message } = req.body;
        
        if (!to) {
            return 'Recipient is required';
        }
        
        if (!subject || subject.trim().length === 0) {
            return 'Subject is required';
        }
        
        if (!message || message.trim().length === 0) {
            return 'Message content is required';
        }
        
        return null;
    }
}

module.exports = ApplicationController;