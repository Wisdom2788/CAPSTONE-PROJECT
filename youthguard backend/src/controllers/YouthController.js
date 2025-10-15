/**
 * Youth Controller - YouthGuard Platform
 * 
 * This controller handles all HTTP requests related to Youth management.
 * It extends the BaseController and provides youth-specific API endpoints
 * for profile management, skill tracking, and career development.
 * 
 * Key Features:
 * - Youth profile management
 * - Skill and interest management
 * - Education and employment tracking
 * - Portfolio and achievement management
 * - Career development tracking
 */

const BaseController = require('./BaseController');
const YouthService = require('../services/YouthService');
const logger = require('../utils/logger');

/**
 * YouthController Class
 * 
 * Controller for Youth model with specialized API endpoints.
 */
class YouthController extends BaseController {
    /**
     * Constructor
     */
    constructor(youthService) {
        super(youthService);
    }
    
    /**
     * Create youth profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createYouthProfile(req, res, next) {
        try {
            logger.info('Creating youth profile', { userId: req.user.id });
            
            // Validate request data
            const validationError = this._validateYouthProfileRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Add user ID to profile data
            const profileData = {
                ...req.body,
                user: req.user.id
            };
            
            // Create youth profile through service
            const youth = await this.service.createYouthProfile(profileData);
            
            logger.info('Youth profile created successfully', { youthId: youth._id });
            
            res.status(201).json({
                success: true,
                message: 'Youth profile created successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error creating youth profile', { 
                error: error.message,
                userId: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get youth profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getYouthProfile(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Getting youth profile', { youthId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Get youth profile through service
            const youth = await this.service.findById(id);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Youth profile retrieved successfully', { youthId: id });
            
            res.status(200).json({
                success: true,
                message: 'Youth profile retrieved successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error getting youth profile', { 
                error: error.message,
                youthId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Update youth profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateYouthProfile(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Updating youth profile', { youthId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateProfileUpdateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Update youth profile through service
            const youth = await this.service.updateYouthProfile(id, req.body);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Youth profile updated successfully', { youthId: id });
            
            res.status(200).json({
                success: true,
                message: 'Youth profile updated successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error updating youth profile', { 
                error: error.message,
                youthId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Update youth education
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateEducation(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Updating youth education', { youthId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateEducationUpdateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Update education through service
            const youth = await this.service.updateEducation(id, req.body);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Youth education updated successfully', { youthId: id });
            
            res.status(200).json({
                success: true,
                message: 'Education updated successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error updating youth education', { 
                error: error.message,
                youthId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Update youth employment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateEmployment(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Updating youth employment', { youthId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateEmploymentUpdateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Update employment through service
            const youth = await this.service.updateEmployment(id, req.body);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Youth employment updated successfully', { youthId: id });
            
            res.status(200).json({
                success: true,
                message: 'Employment updated successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error updating youth employment', { 
                error: error.message,
                youthId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Add skill to youth profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async addSkill(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Adding skill to youth profile', { youthId: id, skill: req.body.name });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateSkillRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Add skill through service
            const youth = await this.service.addSkill(id, req.body);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Skill added to youth profile successfully', { youthId: id, skill: req.body.name });
            
            res.status(200).json({
                success: true,
                message: 'Skill added successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error adding skill to youth profile', { 
                error: error.message,
                youthId: req.params.id,
                skill: req.body.name,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Remove skill from youth profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async removeSkill(req, res, next) {
        try {
            const { id } = req.params;
            const { skillName } = req.params;
            
            logger.info('Removing skill from youth profile', { youthId: id, skill: skillName });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Remove skill through service
            const youth = await this.service.removeSkill(id, skillName);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Skill removed from youth profile successfully', { youthId: id, skill: skillName });
            
            res.status(200).json({
                success: true,
                message: 'Skill removed successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error removing skill from youth profile', { 
                error: error.message,
                youthId: req.params.id,
                skill: req.params.skillName,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Update skill level
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateSkillLevel(req, res, next) {
        try {
            const { id } = req.params;
            const { skillName } = req.params;
            
            logger.info('Updating skill level', { youthId: id, skill: skillName, level: req.body.level });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateSkillLevelRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Update skill level through service
            const youth = await this.service.updateSkillLevel(id, skillName, req.body.level);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Skill level updated successfully', { youthId: id, skill: skillName, level: req.body.level });
            
            res.status(200).json({
                success: true,
                message: 'Skill level updated successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error updating skill level', { 
                error: error.message,
                youthId: req.params.id,
                skill: req.params.skillName,
                level: req.body.level,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Add interest to youth profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async addInterest(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Adding interest to youth profile', { youthId: id, interest: req.body.interest });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateInterestRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Add interest through service
            const youth = await this.service.addInterest(id, req.body.interest);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Interest added to youth profile successfully', { youthId: id, interest: req.body.interest });
            
            res.status(200).json({
                success: true,
                message: 'Interest added successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error adding interest to youth profile', { 
                error: error.message,
                youthId: req.params.id,
                interest: req.body.interest,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Remove interest from youth profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async removeInterest(req, res, next) {
        try {
            const { id } = req.params;
            const { interest } = req.params;
            
            logger.info('Removing interest from youth profile', { youthId: id, interest });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid youth ID format'
                });
            }
            
            // Remove interest through service
            const youth = await this.service.removeInterest(id, interest);
            
            if (!youth) {
                return res.status(404).json({
                    success: false,
                    message: 'Youth profile not found'
                });
            }
            
            logger.info('Interest removed from youth profile successfully', { youthId: id, interest });
            
            res.status(200).json({
                success: true,
                message: 'Interest removed successfully',
                data: youth
            });
            
        } catch (error) {
            logger.error('Error removing interest from youth profile', { 
                error: error.message,
                youthId: req.params.id,
                interest: req.params.interest,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Search youth profiles
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async searchYouth(req, res, next) {
        try {
            logger.info('Searching youth profiles', { 
                query: req.query.q,
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Parse query parameters
            const searchText = req.query.q || '';
            const options = this._parseOptions(req.query);
            
            // Search youth through service
            const result = await this.service.searchYouth(searchText, options);
            
            logger.info('Youth profiles search completed', { count: result.documents.length });
            
            res.status(200).json({
                success: true,
                message: 'Youth profiles search completed',
                data: result.documents,
                pagination: result.pagination
            });
            
        } catch (error) {
            logger.error('Error searching youth profiles', { 
                error: error.message,
                query: req.query.q,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get youth statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getStatistics(req, res, next) {
        try {
            logger.info('Getting youth statistics', { 
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Get statistics through service
            const stats = await this.service.getStatistics();
            
            logger.info('Youth statistics retrieved');
            
            res.status(200).json({
                success: true,
                message: 'Youth statistics retrieved',
                data: stats
            });
            
        } catch (error) {
            logger.error('Error getting youth statistics', { 
                error: error.message,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Validate youth profile request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateYouthProfileRequest(req) {
        // Basic validation - all fields are optional for youth profile
        return null;
    }
    
    /**
     * Validate profile update request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateProfileUpdateRequest(req) {
        // Optional validation - all fields are optional for profile update
        return null;
    }
    
    /**
     * Validate education update request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateEducationUpdateRequest(req) {
        const { level } = req.body;
        
        if (!level) {
            return 'Education level is required';
        }
        
        const validLevels = ['none', 'secondary', 'diploma', 'bachelor', 'master', 'phd'];
        if (!validLevels.includes(level)) {
            return 'Invalid education level';
        }
        
        return null;
    }
    
    /**
     * Validate employment update request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateEmploymentUpdateRequest(req) {
        const { status } = req.body;
        
        if (!status) {
            return 'Employment status is required';
        }
        
        const validStatuses = ['unemployed', 'employed', 'self_employed', 'student', 'seeking'];
        if (!validStatuses.includes(status)) {
            return 'Invalid employment status';
        }
        
        return null;
    }
    
    /**
     * Validate skill request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateSkillRequest(req) {
        const { name, level } = req.body;
        
        if (!name || name.trim().length === 0) {
            return 'Skill name is required';
        }
        
        if (!level) {
            return 'Skill level is required';
        }
        
        const validLevels = ['basic', 'intermediate', 'advanced', 'expert'];
        if (!validLevels.includes(level)) {
            return 'Invalid skill level';
        }
        
        return null;
    }
    
    /**
     * Validate skill level request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateSkillLevelRequest(req) {
        const { level } = req.body;
        
        if (!level) {
            return 'Skill level is required';
        }
        
        const validLevels = ['basic', 'intermediate', 'advanced', 'expert'];
        if (!validLevels.includes(level)) {
            return 'Invalid skill level';
        }
        
        return null;
    }
    
    /**
     * Validate interest request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateInterestRequest(req) {
        const { interest } = req.body;
        
        if (!interest || interest.trim().length === 0) {
            return 'Interest is required';
        }
        
        return null;
    }
}

module.exports = YouthController;