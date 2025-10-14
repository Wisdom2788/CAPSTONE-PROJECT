/**
 * Base Data Transfer Object (DTO) - YouthGuard Platform
 * 
 * This is the base DTO class that provides common functionality for all DTOs.
 * DTOs are used to transfer data between layers while controlling what data is exposed.
 * 
 * Key Features:
 * - Data validation
 * - Transformation methods
 * - Serialization support
 * 
 * Design Pattern: Data Transfer Object (DTO)
 * Purpose: Control data flow between layers and hide internal implementation details.
 */

/**
 * BaseDTO Class
 * 
 * Abstract base class that provides common DTO operations.
 */
class BaseDTO {
    /**
     * Constructor
     * @param {Object} data - Data to initialize the DTO
     */
    constructor(data = {}) {
        this._data = { ...data };
    }
    
    /**
     * Validate DTO data
     * @returns {Array} Array of validation errors
     */
    validate() {
        // Default implementation - can be overridden by subclasses
        return [];
    }
    
    /**
     * Transform DTO to plain object
     * @returns {Object} Plain object representation
     */
    toObject() {
        return { ...this._data };
    }
    
    /**
     * Transform DTO to JSON string
     * @returns {String} JSON representation
     */
    toJSON() {
        return JSON.stringify(this.toObject());
    }
    
    /**
     * Get data value
     * @param {String} key - Data key
     * @returns {*} Data value
     */
    get(key) {
        return this._data[key];
    }
    
    /**
     * Set data value
     * @param {String} key - Data key
     * @param {*} value - Data value
     */
    set(key, value) {
        this._data[key] = value;
    }
    
    /**
     * Check if data key exists
     * @param {String} key - Data key
     * @returns {Boolean} Whether key exists
     */
    has(key) {
        return key in this._data;
    }
    
    /**
     * Remove data key
     * @param {String} key - Data key
     */
    remove(key) {
        delete this._data[key];
    }
    
    /**
     * Get all data keys
     * @returns {Array} Data keys
     */
    keys() {
        return Object.keys(this._data);
    }
    
    /**
     * Get data size
     * @returns {Number} Data size
     */
    size() {
        return Object.keys(this._data).length;
    }
    
    /**
     * Clear all data
     */
    clear() {
        this._data = {};
    }
    
    /**
     * Check if DTO is empty
     * @returns {Boolean} Whether DTO is empty
     */
    isEmpty() {
        return this.size() === 0;
    }
}

module.exports = BaseDTO;