/**
 * Base Controller - YouthGuard Platform
 * 
 * This is the base controller class that provides common HTTP request handling
 * for all controllers. It implements the Controller pattern to handle API endpoints
 * and coordinate between services and HTTP responses.
 * 
 * Key Features:
 * - Generic CRUD operation handlers
 * - HTTP response formatting
 * - Error handling and logging
 * - Request validation
 * - Pagination support
 * - Security middleware integration
 * 
 * Design Pattern: Controller Pattern
 * Purpose: Handle HTTP requests, validate input, call services, and return responses.
 */

const logger = require('../utils/logger');

/**
 * BaseController Class
 * 
 * Abstract base class that provides common controller operations.
 * All specific controllers should extend this class.
 */
class BaseController {
    /**
     * Constructor
     * @param {Object} service - The service for this controller
     */
    constructor(service) {
        if (!service) {
            throw new Error('Service is required for controller');
        }
        
        this.service = service;
        this.controllerName = this.constructor.name;
        
        // Bind methods to preserve context
        this.handleCreate = this.handleCreate.bind(this);
        this.handleGetById = this.handleGetById.bind(this);
        this.handleGetAll = this.handleGetAll.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    /**
     * Handle create operation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async handleCreate(req, res, next) {
        try {
            logger.info(`${this.controllerName}: Creating new entity`, { 
                user: req.user ? req.user.id : 'anonymous',
                body: this._sanitizeLogData(req.body)
            });
            
            // Validate request data
            const validationError = this._validateCreateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Prepare data
            const data = await this._prepareCreateData(req);
            
            // Create entity through service
            const entity = await this.service.create(data, { session: req.session });
            
            logger.info(`${this.controllerName}: Entity created successfully`, { 
                entityId: entity._id,
                user: req.user ? req.user.id : 'anonymous'
            });
            
            res.status(201).json({
                success: true,
                message: 'Entity created successfully',
                data: entity
            });
            
        } catch (error) {
            logger.error(`${this.controllerName}: Error creating entity`, { 
                error: error.message,
                user: req.user ? req.user.id : 'anonymous',
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Handle get by ID operation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async handleGetById(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info(`${this.controllerName}: Getting entity by ID`, { 
                id,
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
            }
            
            // Get entity through service
            const entity = await this.service.findById(id, this._getFindOptions(req));
            
            if (!entity) {
                return res.status(404).json({
                    success: false,
                    message: 'Entity not found'
                });
            }
            
            logger.info(`${this.controllerName}: Entity retrieved successfully`, { id });
            
            res.status(200).json({
                success: true,
                message: 'Entity retrieved successfully',
                data: entity
            });
            
        } catch (error) {
            logger.error(`${this.controllerName}: Error getting entity by ID`, { 
                error: error.message,
                id: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Handle get all operation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async handleGetAll(req, res, next) {
        try {
            logger.info(`${this.controllerName}: Getting all entities`, { 
                user: req.user ? req.user.id : 'anonymous',
                query: this._sanitizeLogData(req.query)
            });
            
            // Parse query parameters
            const criteria = this._parseCriteria(req.query);
            const options = this._parseOptions(req.query);
            
            // Get entities through service
            const result = await this.service.findMany(criteria, options);
            
            logger.info(`${this.controllerName}: Entities retrieved successfully`, { 
                count: result.documents.length,
                pagination: result.pagination
            });
            
            res.status(200).json({
                success: true,
                message: 'Entities retrieved successfully',
                data: result.documents,
                pagination: result.pagination
            });
            
        } catch (error) {
            logger.error(`${this.controllerName}: Error getting entities`, { 
                error: error.message,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Handle update operation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async handleUpdate(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info(`${this.controllerName}: Updating entity`, { 
                id,
                user: req.user ? req.user.id : 'anonymous',
                body: this._sanitizeLogData(req.body)
            });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateUpdateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Prepare update data
            const data = await this._prepareUpdateData(req);
            
            // Update entity through service
            const entity = await this.service.update(id, data, { session: req.session });
            
            if (!entity) {
                return res.status(404).json({
                    success: false,
                    message: 'Entity not found'
                });
            }
            
            logger.info(`${this.controllerName}: Entity updated successfully`, { id });
            
            res.status(200).json({
                success: true,
                message: 'Entity updated successfully',
                data: entity
            });
            
        } catch (error) {
            logger.error(`${this.controllerName}: Error updating entity`, { 
                error: error.message,
                id: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Handle delete operation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async handleDelete(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info(`${this.controllerName}: Deleting entity`, { 
                id,
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
            }
            
            // Delete entity through service
            const entity = await this.service.delete(id, { session: req.session });
            
            if (!entity) {
                return res.status(404).json({
                    success: false,
                    message: 'Entity not found'
                });
            }
            
            logger.info(`${this.controllerName}: Entity deleted successfully`, { id });
            
            res.status(200).json({
                success: true,
                message: 'Entity deleted successfully',
                data: entity
            });
            
        } catch (error) {
            logger.error(`${this.controllerName}: Error deleting entity`, { 
                error: error.message,
                id: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Validate create request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateCreateRequest(req) {
        // Default implementation - can be overridden by subclasses
        return null;
    }
    
    /**
     * Prepare create data
     * @protected
     * @param {Object} req - Express request object
     * @returns {Promise<Object>} Prepared data
     */
    async _prepareCreateData(req) {
        // Default implementation - can be overridden by subclasses
        return req.body;
    }
    
    /**
     * Validate update request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateUpdateRequest(req) {
        // Default implementation - can be overridden by subclasses
        return null;
    }
    
    /**
     * Prepare update data
     * @protected
     * @param {Object} req - Express request object
     * @returns {Promise<Object>} Prepared data
     */
    async _prepareUpdateData(req) {
        // Default implementation - can be overridden by subclasses
        return req.body;
    }
    
    /**
     * Parse search criteria from query parameters
     * @protected
     * @param {Object} query - Query parameters
     * @returns {Object} Parsed criteria
     */
    _parseCriteria(query) {
        const criteria = { ...query };
        
        // Remove pagination and sorting parameters
        delete criteria.page;
        delete criteria.limit;
        delete criteria.sort;
        delete criteria.select;
        delete criteria.populate;
        
        return criteria;
    }
    
    /**
     * Parse options from query parameters
     * @protected
     * @param {Object} query - Query parameters
     * @returns {Object} Parsed options
     */
    _parseOptions(query) {
        const options = {};
        
        // Pagination
        if (query.page) options.page = parseInt(query.page);
        if (query.limit) options.limit = parseInt(query.limit);
        
        // Sorting
        if (query.sort) options.sort = query.sort;
        
        // Field selection
        if (query.select) options.select = query.select;
        
        // Population
        if (query.populate) options.populate = query.populate;
        
        return options;
    }
    
    /**
     * Get find options
     * @protected
     * @param {Object} req - Express request object
     * @returns {Object} Find options
     */
    _getFindOptions(req) {
        // Default implementation - can be overridden by subclasses
        return {};
    }
    
    /**
     * Validate entity ID
     * @protected
     * @param {String} id - ID to validate
     * @returns {Boolean} Whether ID is valid
     */
    _isValidId(id) {
        // Default implementation - can be overridden by subclasses
        return typeof id === 'string' && id.length > 0;
    }
    
    /**
     * Handle controller errors
     * @protected
     * @param {Error} error - Original error
     * @returns {Error} Processed error
     */
    _handleControllerError(error) {
        // Log error
        logger.error(`${this.controllerName} controller error`, { 
            error: error.message,
            stack: error.stack
        });
        
        // Return appropriate HTTP error
        if (error.name === 'ValidationError') {
            error.statusCode = 400;
        } else if (error.name === 'CastError') {
            error.statusCode = 400;
        } else if (error.name === 'DuplicateError') {
            error.statusCode = 409;
        } else if (!error.statusCode) {
            error.statusCode = 500;
        }
        
        return error;
    }
    
    /**
     * Sanitize data for logging (remove sensitive information)
     * @protected
     * @param {Object} data - Data to sanitize
     * @returns {Object} Sanitized data
     */
    _sanitizeLogData(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
        const sanitized = { ...data };
        
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });
        
        return sanitized;
    }
    
    /**
     * Send success response
     * @protected
     * @param {Object} res - Express response object
     * @param {Object} data - Response data
     * @param {String} message - Success message
     * @param {Number} statusCode - HTTP status code
     */
    _sendSuccess(res, data, message = 'Operation successful', statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    
    /**
     * Send error response
     * @protected
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     * @param {Number} statusCode - HTTP status code
     * @param {Object} error - Error details
     */
    _sendError(res, message = 'Operation failed', statusCode = 500, error = null) {
        const response = {
            success: false,
            message
        };
        
        if (error) {
            response.error = error;
        }
        
        res.status(statusCode).json(response);
    }
    
    /**
     * Get controller name
     * @returns {String} Controller name
     */
    getControllerName() {
        return this.controllerName;
    }
    
    /**
     * Get service
     * @returns {Object} Service instance
     */
    getService() {
        return this.service;
    }
}

module.exports = BaseController;