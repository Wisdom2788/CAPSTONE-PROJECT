/**
 * Base Repository - YouthGuard Platform
 * 
 * This is the base repository class that provides common database operations
 * for all models. It implements the Repository pattern to abstract database
 * operations and provide a consistent interface across all data access layers.
 * 
 * Key Features:
 * - Generic CRUD operations
 * - Query building and filtering
 * - Pagination support
 * - Error handling and validation
 * - Transaction support
 * - Caching mechanisms
 * 
 * Design Pattern: Repository Pattern
 * Purpose: Encapsulate data access logic and provide a more object-oriented
 * view of the persistence layer.
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * BaseRepository Class
 * 
 * Abstract base class that provides common database operations.
 * All specific repositories should extend this class.
 */
class BaseRepository {
    /**
     * Constructor
     * @param {mongoose.Model} model - The Mongoose model for this repository
     */
    constructor(model) {
        if (!model) {
            throw new Error('Model is required for repository');
        }
        
        this.model = model;
        this.modelName = model.modelName;
        
        // Bind methods to preserve context
        this.create = this.create.bind(this);
        this.findById = this.findById.bind(this);
        this.findOne = this.findOne.bind(this);
        this.findMany = this.findMany.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    
    /**
     * Create a new document
     * @param {Object} data - Data for the new document
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Created document
     */
    async create(data, options = {}) {
        try {
            logger.info(`Creating new ${this.modelName}`, { data: this._sanitizeLogData(data) });
            
            const document = new this.model(data);
            
            if (options.session) {
                const result = await document.save({ session: options.session });
                logger.info(`${this.modelName} created successfully`, { id: result._id });
                return result;
            }
            
            const result = await document.save();
            logger.info(`${this.modelName} created successfully`, { id: result._id });
            return result;
            
        } catch (error) {
            logger.error(`Error creating ${this.modelName}`, { 
                error: error.message, 
                data: this._sanitizeLogData(data) 
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Create multiple documents
     * @param {Array} dataArray - Array of data objects
     * @param {Object} options - Additional options
     * @returns {Promise<Array>} Created documents
     */
    async createMany(dataArray, options = {}) {
        try {
            logger.info(`Creating multiple ${this.modelName}s`, { count: dataArray.length });
            
            const result = await this.model.insertMany(dataArray, {
                session: options.session,
                ordered: options.ordered !== false // Default to ordered
            });
            
            logger.info(`${this.modelName}s created successfully`, { count: result.length });
            return result;
            
        } catch (error) {
            logger.error(`Error creating multiple ${this.modelName}s`, { 
                error: error.message,
                count: dataArray.length
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Find a document by ID
     * @param {String} id - Document ID
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found document or null
     */
    async findById(id, options = {}) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.warn(`Invalid ObjectId provided for ${this.modelName}`, { id });
                return null;
            }
            
            let query = this.model.findById(id);
            
            // Apply population
            if (options.populate) {
                query = this._applyPopulation(query, options.populate);
            }
            
            // Apply field selection
            if (options.select) {
                query = query.select(options.select);
            }
            
            const result = await query.exec();
            
            if (result) {
                logger.debug(`${this.modelName} found by ID`, { id });
            } else {
                logger.debug(`${this.modelName} not found by ID`, { id });
            }
            
            return result;
            
        } catch (error) {
            logger.error(`Error finding ${this.modelName} by ID`, { 
                error: error.message, 
                id 
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Find one document by criteria
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found document or null
     */
    async findOne(criteria = {}, options = {}) {
        try {
            let query = this.model.findOne(criteria);
            
            // Apply population
            if (options.populate) {
                query = this._applyPopulation(query, options.populate);
            }
            
            // Apply field selection
            if (options.select) {
                query = query.select(options.select);
            }
            
            // Apply sorting
            if (options.sort) {
                query = query.sort(options.sort);
            }
            
            const result = await query.exec();
            
            logger.debug(`${this.modelName} findOne query executed`, { 
                criteria: this._sanitizeLogData(criteria),
                found: !!result
            });
            
            return result;
            
        } catch (error) {
            logger.error(`Error finding ${this.modelName}`, { 
                error: error.message, 
                criteria: this._sanitizeLogData(criteria)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Find multiple documents with pagination
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Object containing documents and pagination info
     */
    async findMany(criteria = {}, options = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                sort = { createdAt: -1 },
                populate,
                select
            } = options;
            
            // Calculate skip value for pagination
            const skip = (page - 1) * limit;
            
            // Build main query
            let query = this.model.find(criteria);
            
            // Apply population
            if (populate) {
                query = this._applyPopulation(query, populate);
            }
            
            // Apply field selection
            if (select) {
                query = query.select(select);
            }
            
            // Apply sorting, pagination
            query = query.sort(sort).skip(skip).limit(limit);
            
            // Execute query and count in parallel
            const [documents, totalCount] = await Promise.all([
                query.exec(),
                this.model.countDocuments(criteria)
            ]);
            
            // Calculate pagination metadata
            const totalPages = Math.ceil(totalCount / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            
            const result = {
                documents,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage ? page + 1 : null,
                    prevPage: hasPrevPage ? page - 1 : null
                }
            };
            
            logger.debug(`${this.modelName} findMany query executed`, {
                criteria: this._sanitizeLogData(criteria),
                count: documents.length,
                totalCount,
                page,
                limit
            });
            
            return result;
            
        } catch (error) {
            logger.error(`Error finding multiple ${this.modelName}s`, { 
                error: error.message,
                criteria: this._sanitizeLogData(criteria),
                options
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Update a document by ID
     * @param {String} id - Document ID
     * @param {Object} updateData - Data to update
     * @param {Object} options - Update options
     * @returns {Promise<Object|null>} Updated document or null
     */
    async update(id, updateData, options = {}) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.warn(`Invalid ObjectId provided for ${this.modelName} update`, { id });
                return null;
            }
            
            const updateOptions = {
                new: true, // Return updated document
                runValidators: true, // Run schema validators
                session: options.session,
                ...options
            };
            
            let query = this.model.findByIdAndUpdate(id, updateData, updateOptions);
            
            // Apply population to get populated result
            if (options.populate) {
                query = this._applyPopulation(query, options.populate);
            }
            
            const result = await query.exec();
            
            if (result) {
                logger.info(`${this.modelName} updated successfully`, { 
                    id,
                    fieldsUpdated: Object.keys(updateData)
                });
            } else {
                logger.warn(`${this.modelName} not found for update`, { id });
            }
            
            return result;
            
        } catch (error) {
            logger.error(`Error updating ${this.modelName}`, { 
                error: error.message,
                id,
                updateData: this._sanitizeLogData(updateData)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Update multiple documents
     * @param {Object} criteria - Update criteria
     * @param {Object} updateData - Data to update
     * @param {Object} options - Update options
     * @returns {Promise<Object>} Update result
     */
    async updateMany(criteria, updateData, options = {}) {
        try {
            const updateOptions = {
                runValidators: true,
                session: options.session,
                ...options
            };
            
            const result = await this.model.updateMany(criteria, updateData, updateOptions);
            
            logger.info(`${this.modelName}s updated`, {
                criteria: this._sanitizeLogData(criteria),
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount
            });
            
            return result;
            
        } catch (error) {
            logger.error(`Error updating multiple ${this.modelName}s`, {
                error: error.message,
                criteria: this._sanitizeLogData(criteria),
                updateData: this._sanitizeLogData(updateData)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Delete a document by ID
     * @param {String} id - Document ID
     * @param {Object} options - Delete options
     * @returns {Promise<Object|null>} Deleted document or null
     */
    async delete(id, options = {}) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.warn(`Invalid ObjectId provided for ${this.modelName} delete`, { id });
                return null;
            }
            
            const result = await this.model.findByIdAndDelete(id, {
                session: options.session
            });
            
            if (result) {
                logger.info(`${this.modelName} deleted successfully`, { id });
            } else {
                logger.warn(`${this.modelName} not found for deletion`, { id });
            }
            
            return result;
            
        } catch (error) {
            logger.error(`Error deleting ${this.modelName}`, { 
                error: error.message,
                id
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Delete multiple documents
     * @param {Object} criteria - Delete criteria
     * @param {Object} options - Delete options
     * @returns {Promise<Object>} Delete result
     */
    async deleteMany(criteria, options = {}) {
        try {
            const result = await this.model.deleteMany(criteria, {
                session: options.session
            });
            
            logger.info(`${this.modelName}s deleted`, {
                criteria: this._sanitizeLogData(criteria),
                deletedCount: result.deletedCount
            });
            
            return result;
            
        } catch (error) {
            logger.error(`Error deleting multiple ${this.modelName}s`, {
                error: error.message,
                criteria: this._sanitizeLogData(criteria)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Count documents matching criteria
     * @param {Object} criteria - Count criteria
     * @returns {Promise<Number>} Document count
     */
    async count(criteria = {}) {
        try {
            const count = await this.model.countDocuments(criteria);
            
            logger.debug(`${this.modelName} count query executed`, {
                criteria: this._sanitizeLogData(criteria),
                count
            });
            
            return count;
            
        } catch (error) {
            logger.error(`Error counting ${this.modelName}s`, {
                error: error.message,
                criteria: this._sanitizeLogData(criteria)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Check if document exists
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Boolean>} Whether document exists
     */
    async exists(criteria) {
        try {
            const exists = await this.model.exists(criteria);
            
            logger.debug(`${this.modelName} exists query executed`, {
                criteria: this._sanitizeLogData(criteria),
                exists: !!exists
            });
            
            return !!exists;
            
        } catch (error) {
            logger.error(`Error checking ${this.modelName} existence`, {
                error: error.message,
                criteria: this._sanitizeLogData(criteria)
            });
            throw this._handleError(error);
        }
    }
    
    /**
     * Execute aggregation pipeline
     * @param {Array} pipeline - Aggregation pipeline
     * @param {Object} options - Aggregation options
     * @returns {Promise<Array>} Aggregation result
     */
    async aggregate(pipeline, options = {}) {
        try {
            const result = await this.model.aggregate(pipeline, options);
            
            logger.debug(`${this.modelName} aggregation executed`, {
                pipelineStages: pipeline.length,
                resultCount: result.length
            });
            
            return result;
            
        } catch (error) {
            logger.error(`Error executing ${this.modelName} aggregation`, {
                error: error.message,
                pipeline: JSON.stringify(pipeline)
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
        const session = await mongoose.startSession();
        
        try {
            const result = await session.withTransaction(async () => {
                return await operation(session);
            });
            
            logger.info(`${this.modelName} transaction completed successfully`);
            return result;
            
        } catch (error) {
            logger.error(`${this.modelName} transaction failed`, {
                error: error.message
            });
            throw this._handleError(error);
            
        } finally {
            await session.endSession();
        }
    }
    
    /**
     * Apply population to query
     * @private
     * @param {mongoose.Query} query - Mongoose query
     * @param {String|Array|Object} populate - Population options
     * @returns {mongoose.Query} Query with population applied
     */
    _applyPopulation(query, populate) {
        if (Array.isArray(populate)) {
            populate.forEach(pop => {
                query = query.populate(pop);
            });
        } else {
            query = query.populate(populate);
        }
        return query;
    }
    
    /**
     * Handle database errors
     * @private
     * @param {Error} error - Original error
     * @returns {Error} Processed error
     */
    _handleError(error) {
        // Handle specific MongoDB/Mongoose errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message,
                value: err.value
            }));
            
            const customError = new Error('Validation failed');
            customError.name = 'ValidationError';
            customError.errors = validationErrors;
            customError.statusCode = 400;
            
            return customError;
        }
        
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            const customError = new Error(`Duplicate value for field: ${field}`);
            customError.name = 'DuplicateError';
            customError.field = field;
            customError.statusCode = 409;
            
            return customError;
        }
        
        if (error.name === 'CastError') {
            const customError = new Error(`Invalid ${error.path}: ${error.value}`);
            customError.name = 'CastError';
            customError.statusCode = 400;
            
            return customError;
        }
        
        // Return original error for unhandled cases
        return error;
    }
    
    /**
     * Sanitize data for logging (remove sensitive information)
     * @private
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
     * Get model name
     * @returns {String} Model name
     */
    getModelName() {
        return this.modelName;
    }
    
    /**
     * Get raw model (use with caution)
     * @returns {mongoose.Model} Mongoose model
     */
    getModel() {
        return this.model;
    }
}

module.exports = BaseRepository;