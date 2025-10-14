/**
 * Service Interface - YouthGuard Platform
 * 
 * This interface defines the contract for all service classes.
 * It ensures consistent method signatures across all services.
 * 
 * Design Pattern: Interface (simulated in JavaScript)
 * Purpose: Define a contract for service implementations.
 */

/**
 * ServiceInterface
 * 
 * Interface that all services should implement.
 */
class ServiceInterface {
    /**
     * Create a new entity
     * @param {Object} data - Data for the new entity
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Created entity
     */
    async create(data, options = {}) {
        throw new Error('Method not implemented: create');
    }
    
    /**
     * Find an entity by ID
     * @param {String} id - Entity ID
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found entity or null
     */
    async findById(id, options = {}) {
        throw new Error('Method not implemented: findById');
    }
    
    /**
     * Find one entity by criteria
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object|null>} Found entity or null
     */
    async findOne(criteria = {}, options = {}) {
        throw new Error('Method not implemented: findOne');
    }
    
    /**
     * Find multiple entities with pagination
     * @param {Object} criteria - Search criteria
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Object containing entities and pagination info
     */
    async findMany(criteria = {}, options = {}) {
        throw new Error('Method not implemented: findMany');
    }
    
    /**
     * Update an entity by ID
     * @param {String} id - Entity ID
     * @param {Object} updateData - Data to update
     * @param {Object} options - Update options
     * @returns {Promise<Object|null>} Updated entity or null
     */
    async update(id, updateData, options = {}) {
        throw new Error('Method not implemented: update');
    }
    
    /**
     * Delete an entity by ID
     * @param {String} id - Entity ID
     * @param {Object} options - Delete options
     * @returns {Promise<Object|null>} Deleted entity or null
     */
    async delete(id, options = {}) {
        throw new Error('Method not implemented: delete');
    }
    
    /**
     * Count entities matching criteria
     * @param {Object} criteria - Count criteria
     * @returns {Promise<Number>} Entity count
     */
    async count(criteria = {}) {
        throw new Error('Method not implemented: count');
    }
    
    /**
     * Check if entity exists
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Boolean>} Whether entity exists
     */
    async exists(criteria) {
        throw new Error('Method not implemented: exists');
    }
}

module.exports = ServiceInterface;