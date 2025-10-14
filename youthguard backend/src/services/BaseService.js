/**
 * Base Service - YouthGuard Platform
 * 
 * This is the base service class that provides common business logic
 * for all services. It implements the Service pattern to encapsulate
 * business rules and coordinate between repositories and controllers.
 * 
 * Key Features:
 * - Generic CRUD operations with business logic
 * - Validation and data transformation
 * - Error handling and logging
 * - Transaction management
 * - Caching mechanisms
 * - Event emission
 * 
 * Design Pattern: Service Pattern
 * Purpose: Encapsulate business logic and provide a clean interface
 * between controllers and data access layers.
 */

const logger = require('../utils/logger');
const { EventEmitter } = require('events');

/**
 * BaseService Class
 * 
 * Abstract base class that provides common service operations.
 * All specific services should extend this class.
 */
class BaseService {
    /**
     * Constructor
     * @param {Object} repository - The repository for this service
     */
    constructor(repository) {
        if (!repository) {
            throw new Error('Repository is required for service');
        }
        
        this.repository = repository;
        this.serviceName = this.constructor.name;
        this.eventEmitter = new EventEmitter();
        
        // Bind methods to preserve context
        this.create = this.create.bind(this);
        this.findById = this.findById.bind(this);
        this.findOne = this.findOne.bind(this);
        this.findMany = this.findMany.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    
    /**
     * Create a new entity
     * @param {Object} data - Data for the new entity
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Created entity
     */
    async create(data, options = {}) {
        try {
            logger.info(`Creating new ${this.serviceName}`, { data: this._sanitizeLogData(data) });
            
            // Validate data before creation
            const validatedData = await this._validateCreateData(data);
            
            // Transform data if needed
            const transformedData = await this._transformCreateData(validatedData);
            
            // Create entity through repository
            const entity = await this.repository.create(transformedData, options);
            
            // Emit creation event
            this._emitEvent('created', entity);
            
            logger.info(`${this.serviceName} created successfully`, { id: entity._id });
            return entity;
            
        } catch (error) {
            logger.error(`Error creating ${this.serviceName}`, { 
                error: error.message, 
                data: this._sanitizeLogData(data) 
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Find an entity by ID
     * @param {String} id - Entity ID
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found entity or null
     */
    async findById(id, options = {}) {
        try {
            logger.debug(`Finding ${this.serviceName} by ID`, { id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                logger.warn(`Invalid ID provided for ${this.serviceName}`, { id });
                return null;
            }
            
            // Find entity through repository
            const entity = await this.repository.findById(id, options);
            
            // Transform entity if found
            if (entity) {
                const transformedEntity = await this._transformEntity(entity);
                logger.debug(`${this.serviceName} found by ID`, { id });
                return transformedEntity;
            }
            
            logger.debug(`${this.serviceName} not found by ID`, { id });
            return null;
            
        } catch (error) {
            logger.error(`Error finding ${this.serviceName} by ID`, { 
                error: error.message, 
                id 
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Find one entity by criteria
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found entity or null
     */
    async findOne(criteria = {}, options = {}) {
        try {
            logger.debug(`Finding one ${this.serviceName}`, { 
                criteria: this._sanitizeLogData(criteria) 
            });
            
            // Validate criteria
            const validatedCriteria = await this._validateFindCriteria(criteria);
            
            // Find entity through repository
            const entity = await this.repository.findOne(validatedCriteria, options);
            
            // Transform entity if found
            if (entity) {
                const transformedEntity = await this._transformEntity(entity);
                logger.debug(`${this.serviceName} found`, { 
                    criteria: this._sanitizeLogData(criteria),
                    id: entity._id
                });
                return transformedEntity;
            }
            
            logger.debug(`${this.serviceName} not found`, { 
                criteria: this._sanitizeLogData(criteria) 
            });
            return null;
            
        } catch (error) {
            logger.error(`Error finding ${this.serviceName}`, { 
                error: error.message, 
                criteria: this._sanitizeLogData(criteria)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Find multiple entities with pagination
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Object containing entities and pagination info
     */
    async findMany(criteria = {}, options = {}) {
        try {
            logger.debug(`Finding multiple ${this.serviceName}s`, { 
                criteria: this._sanitizeLogData(criteria),
                options
            });
            
            // Validate criteria
            const validatedCriteria = await this._validateFindCriteria(criteria);
            
            // Find entities through repository
            const result = await this.repository.findMany(validatedCriteria, options);
            
            // Transform entities
            if (result.documents && result.documents.length > 0) {
                result.documents = await Promise.all(
                    result.documents.map(entity => this._transformEntity(entity))
                );
            }
            
            logger.debug(`${this.serviceName}s found`, { 
                criteria: this._sanitizeLogData(criteria),
                count: result.documents ? result.documents.length : 0,
                pagination: result.pagination
            });
            
            return result;
            
        } catch (error) {
            logger.error(`Error finding multiple ${this.serviceName}s`, { 
                error: error.message,
                criteria: this._sanitizeLogData(criteria),
                options
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Update an entity by ID
     * @param {String} id - Entity ID
     * @param {Object} updateData - Data to update
     * @param {Object} options - Update options
     * @returns {Promise<Object|null>} Updated entity or null
     */
    async update(id, updateData, options = {}) {
        try {
            logger.info(`Updating ${this.serviceName}`, { 
                id,
                updateData: this._sanitizeLogData(updateData)
            });
            
            // Validate ID
            if (!this._isValidId(id)) {
                logger.warn(`Invalid ID provided for ${this.serviceName} update`, { id });
                return null;
            }
            
            // Validate update data
            const validatedData = await this._validateUpdateData(updateData);
            
            // Transform update data
            const transformedData = await this._transformUpdateData(validatedData);
            
            // Update entity through repository
            const entity = await this.repository.update(id, transformedData, options);
            
            // Emit update event if successful
            if (entity) {
                this._emitEvent('updated', entity);
                logger.info(`${this.serviceName} updated successfully`, { id });
            } else {
                logger.warn(`${this.serviceName} not found for update`, { id });
            }
            
            return entity;
            
        } catch (error) {
            logger.error(`Error updating ${this.serviceName}`, { 
                error: error.message,
                id,
                updateData: this._sanitizeLogData(updateData)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Delete an entity by ID
     * @param {String} id - Entity ID
     * @param {Object} options - Delete options
     * @returns {Promise<Object|null>} Deleted entity or null
     */
    async delete(id, options = {}) {
        try {
            logger.info(`Deleting ${this.serviceName}`, { id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                logger.warn(`Invalid ID provided for ${this.serviceName} delete`, { id });
                return null;
            }
            
            // Check if entity exists and can be deleted
            const entity = await this.repository.findById(id);
            if (!entity) {
                logger.warn(`${this.serviceName} not found for deletion`, { id });
                return null;
            }
            
            // Validate deletion
            const canDelete = await this._canDelete(entity);
            if (!canDelete) {
                throw new Error(`${this.serviceName} cannot be deleted`);
            }
            
            // Delete entity through repository
            const deletedEntity = await this.repository.delete(id, options);
            
            // Emit deletion event if successful
            if (deletedEntity) {
                this._emitEvent('deleted', deletedEntity);
                logger.info(`${this.serviceName} deleted successfully`, { id });
            } else {
                logger.warn(`${this.serviceName} not found for deletion`, { id });
            }
            
            return deletedEntity;
            
        } catch (error) {
            logger.error(`Error deleting ${this.serviceName}`, { 
                error: error.message,
                id
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Count entities matching criteria
     * @param {Object} criteria - Count criteria
     * @returns {Promise<Number>} Entity count
     */
    async count(criteria = {}) {
        try {
            logger.debug(`Counting ${this.serviceName}s`, { 
                criteria: this._sanitizeLogData(criteria)
            });
            
            // Validate criteria
            const validatedCriteria = await this._validateFindCriteria(criteria);
            
            const count = await this.repository.count(validatedCriteria);
            
            logger.debug(`${this.serviceName} count`, { 
                criteria: this._sanitizeLogData(criteria),
                count
            });
            
            return count;
            
        } catch (error) {
            logger.error(`Error counting ${this.serviceName}s`, {
                error: error.message,
                criteria: this._sanitizeLogData(criteria)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Check if entity exists
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Boolean>} Whether entity exists
     */
    async exists(criteria) {
        try {
            logger.debug(`Checking ${this.serviceName} existence`, { 
                criteria: this._sanitizeLogData(criteria)
            });
            
            // Validate criteria
            const validatedCriteria = await this._validateFindCriteria(criteria);
            
            const exists = await this.repository.exists(validatedCriteria);
            
            logger.debug(`${this.serviceName} existence check`, { 
                criteria: this._sanitizeLogData(criteria),
                exists
            });
            
            return exists;
            
        } catch (error) {
            logger.error(`Error checking ${this.serviceName} existence`, {
                error: error.message,
                criteria: this._sanitizeLogData(criteria)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Execute within a transaction
     * @param {Function} operation - Operation to execute
     * @returns {Promise} Operation result
     */
    async withTransaction(operation) {
        try {
            logger.info(`${this.serviceName} executing transaction`);
            
            const result = await this.repository.withTransaction(operation);
            
            logger.info(`${this.serviceName} transaction completed successfully`);
            return result;
            
        } catch (error) {
            logger.error(`${this.serviceName} transaction failed`, {
                error: error.message
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Validate data for creation
     * @protected
     * @param {Object} data - Data to validate
     * @returns {Promise<Object>} Validated data
     */
    async _validateCreateData(data) {
        // Default implementation - can be overridden by subclasses
        return data;
    }
    
    /**
     * Transform data for creation
     * @protected
     * @param {Object} data - Data to transform
     * @returns {Promise<Object>} Transformed data
     */
    async _transformCreateData(data) {
        // Default implementation - can be overridden by subclasses
        return data;
    }
    
    /**
     * Validate data for update
     * @protected
     * @param {Object} data - Data to validate
     * @returns {Promise<Object>} Validated data
     */
    async _validateUpdateData(data) {
        // Default implementation - can be overridden by subclasses
        return data;
    }
    
    /**
     * Transform data for update
     * @protected
     * @param {Object} data - Data to transform
     * @returns {Promise<Object>} Transformed data
     */
    async _transformUpdateData(data) {
        // Default implementation - can be overridden by subclasses
        return data;
    }
    
    /**
     * Validate find criteria
     * @protected
     * @param {Object} criteria - Criteria to validate
     * @returns {Promise<Object>} Validated criteria
     */
    async _validateFindCriteria(criteria) {
        // Default implementation - can be overridden by subclasses
        return criteria;
    }
    
    /**
     * Transform entity for output
     * @protected
     * @param {Object} entity - Entity to transform
     * @returns {Promise<Object>} Transformed entity
     */
    async _transformEntity(entity) {
        // Default implementation - can be overridden by subclasses
        return entity;
    }
    
    /**
     * Check if entity can be deleted
     * @protected
     * @param {Object} entity - Entity to check
     * @returns {Promise<Boolean>} Whether entity can be deleted
     */
    async _canDelete(entity) {
        // Default implementation - can be overridden by subclasses
        return true;
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
     * Handle service errors
     * @protected
     * @param {Error} error - Original error
     * @returns {Error} Processed error
     */
    _handleError(error) {
        // Log error
        logger.error(`${this.serviceName} error`, { 
            error: error.message,
            stack: error.stack
        });
        
        // Return original error for now
        // Can be enhanced to provide more specific error handling
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
     * Emit service event
     * @protected
     * @param {String} event - Event name
     * @param {Object} data - Event data
     */
    _emitEvent(event, data) {
        try {
            this.eventEmitter.emit(`${this.serviceName.toLowerCase()}:${event}`, data);
        } catch (error) {
            logger.warn(`Error emitting ${this.serviceName} event`, {
                error: error.message,
                event,
                data: this._sanitizeLogData(data)
            });
        }
    }
    
    /**
     * Add event listener
     * @param {String} event - Event name
     * @param {Function} listener - Event listener
     */
    on(event, listener) {
        this.eventEmitter.on(`${this.serviceName.toLowerCase()}:${event}`, listener);
    }
    
    /**
     * Remove event listener
     * @param {String} event - Event name
     * @param {Function} listener - Event listener
     */
    off(event, listener) {
        this.eventEmitter.off(`${this.serviceName.toLowerCase()}:${event}`, listener);
    }
    
    /**
     * Get service name
     * @returns {String} Service name
     */
    getServiceName() {
        return this.serviceName;
    }
    
    /**
     * Get repository
     * @returns {Object} Repository instance
     */
    getRepository() {
        return this.repository;
    }
}

module.exports = BaseService;