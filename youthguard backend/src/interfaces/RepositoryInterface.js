/**
 * Repository Interface - YouthGuard Platform
 * 
 * This interface defines the contract for all repository classes.
 * It ensures consistent method signatures across all repositories.
 * 
 * Design Pattern: Interface (simulated in JavaScript)
 * Purpose: Define a contract for repository implementations.
 */

/**
 * RepositoryInterface
 * 
 * Interface that all repositories should implement.
 */
class RepositoryInterface {
    /**
     * Create a new document
     * @param {Object} data - Data for the new document
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Created document
     */
    async create(data, options = {}) {
        throw new Error('Method not implemented: create');
    }
    
    /**
     * Create multiple documents
     * @param {Array} dataArray - Array of data objects
     * @param {Object} options - Additional options
     * @returns {Promise<Array>} Created documents
     */
    async createMany(dataArray, options = {}) {
        throw new Error('Method not implemented: createMany');
    }
    
    /**
     * Find a document by ID
     * @param {String} id - Document ID
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found document or null
     */
    async findById(id, options = {}) {
        throw new Error('Method not implemented: findById');
    }
    
    /**
     * Find one document by criteria
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found document or null
     */
    async findOne(criteria = {}, options = {}) {
        throw new Error('Method not implemented: findOne');
    }
    
    /**
     * Find multiple documents with pagination
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Object containing documents and pagination info
     */
    async findMany(criteria = {}, options = {}) {
        throw new Error('Method not implemented: findMany');
    }
    
    /**
     * Update a document by ID
     * @param {String} id - Document ID
     * @param {Object} updateData - Data to update
     * @param {Object} options - Update options
     * @returns {Promise<Object|null>} Updated document or null
     */
    async update(id, updateData, options = {}) {
        throw new Error('Method not implemented: update');
    }
    
    /**
     * Update multiple documents
     * @param {Object} criteria - Update criteria
     * @param {Object} updateData - Data to update
     * @param {Object} options - Update options
     * @returns {Promise<Object>} Update result
     */
    async updateMany(criteria, updateData, options = {}) {
        throw new Error('Method not implemented: updateMany');
    }
    
    /**
     * Delete a document by ID
     * @param {String} id - Document ID
     * @param {Object} options - Delete options
     * @returns {Promise<Object|null>} Deleted document or null
     */
    async delete(id, options = {}) {
        throw new Error('Method not implemented: delete');
    }
    
    /**
     * Delete multiple documents
     * @param {Object} criteria - Delete criteria
     * @param {Object} options - Delete options
     * @returns {Promise<Object>} Delete result
     */
    async deleteMany(criteria, options = {}) {
        throw new Error('Method not implemented: deleteMany');
    }
    
    /**
     * Count documents matching criteria
     * @param {Object} criteria - Count criteria
     * @returns {Promise<Number>} Document count
     */
    async count(criteria = {}) {
        throw new Error('Method not implemented: count');
    }
    
    /**
     * Check if document exists
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Boolean>} Whether document exists
     */
    async exists(criteria) {
        throw new Error('Method not implemented: exists');
    }
    
    /**
     * Execute aggregation pipeline
     * @param {Array} pipeline - Aggregation pipeline
     * @param {Object} options - Aggregation options
     * @returns {Promise<Array>} Aggregation result
     */
    async aggregate(pipeline, options = {}) {
        throw new Error('Method not implemented: aggregate');
    }
    
    /**
     * Execute within a transaction
     * @param {Function} operation - Operation to execute
     * @returns {Promise} Operation result
     */
    async withTransaction(operation) {
        throw new Error('Method not implemented: withTransaction');
    }
}

module.exports = RepositoryInterface;