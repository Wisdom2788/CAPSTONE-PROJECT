/**
 * Dependency Injection Container - YouthGuard Platform
 * 
 * This container manages service instantiation and dependency resolution.
 * It implements the Inversion of Control (IoC) pattern to decouple components.
 * 
 * Key Features:
 * - Singleton service management
 * - Lazy instantiation
 * - Circular dependency detection
 * - Service resolution
 * 
 * Design Pattern: Dependency Injection Container
 * Purpose: Centralize object creation and dependency management.
 */

/**
 * DIContainer Class
 * 
 * Dependency Injection Container for managing service instances.
 */
class DIContainer {
    /**
     * Constructor
     */
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
        this.resolving = new Set();
    }
    
    /**
     * Register a service
     * @param {String} name - Service name
     * @param {Function|Object} factory - Factory function or instance
     * @param {Object} options - Registration options
     * @returns {DIContainer} This container instance
     */
    register(name, factory, options = {}) {
        if (this.services.has(name)) {
            throw new Error(`Service ${name} is already registered`);
        }
        
        this.services.set(name, {
            factory,
            singleton: options.singleton !== false, // Default to singleton
            instance: null
        });
        
        return this;
    }
    
    /**
     * Resolve a service
     * @param {String} name - Service name
     * @returns {*} Service instance
     */
    resolve(name) {
        if (!this.services.has(name)) {
            throw new Error(`Service ${name} is not registered`);
        }
        
        // Check for circular dependencies
        if (this.resolving.has(name)) {
            throw new Error(`Circular dependency detected for service ${name}`);
        }
        
        const service = this.services.get(name);
        
        // Return singleton instance if already created
        if (service.singleton && service.instance) {
            return service.instance;
        }
        
        // Mark as resolving to detect circular dependencies
        this.resolving.add(name);
        
        try {
            let instance;
            
            if (typeof service.factory === 'function') {
                // Factory function - call it to create instance
                instance = service.factory(this);
            } else {
                // Direct instance
                instance = service.factory;
            }
            
            // Store singleton instance
            if (service.singleton) {
                service.instance = instance;
            }
            
            return instance;
        } finally {
            // Remove from resolving set
            this.resolving.delete(name);
        }
    }
    
    /**
     * Check if a service is registered
     * @param {String} name - Service name
     * @returns {Boolean} Whether service is registered
     */
    has(name) {
        return this.services.has(name);
    }
    
    /**
     * Get all registered service names
     * @returns {Array} Service names
     */
    getServiceNames() {
        return Array.from(this.services.keys());
    }
    
    /**
     * Clear all services
     */
    clear() {
        this.services.clear();
        this.singletons.clear();
        this.resolving.clear();
    }
    
    /**
     * Reset singleton instances
     */
    resetSingletons() {
        this.singletons.clear();
        for (const [name, service] of this.services) {
            if (service.singleton) {
                service.instance = null;
            }
        }
    }
}

module.exports = DIContainer;