/**
 * Job Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for Job documents.
 * It extends the BaseRepository and provides job-specific functionality
 * such as job search, application tracking, and employer management.
 * 
 * Key Features:
 * - Job search and filtering
 * - Location-based job search
 * - Application tracking
 * - Employer job management
 * - Job analytics
 * - Featured job management
 */

const BaseRepository = require('./BaseRepository');
const Job = require('../models/Job');
const logger = require('../utils/logger');

/**
 * JobRepository Class
 * 
 * Repository for Job model with specialized operations.
 */
class JobRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(Job);
    }
    
    /**
     * Find jobs by category
     * @param {String} category - Primary category
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Jobs with pagination
     */
    async findByCategory(category, options = {}) {
        try {
            const result = await this.findMany(
                { 'category.primary': category, status: 'active' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding jobs by category', { 
                error: error.message, 
                category 
            });
            throw error;
        }
    }
    
    /**
     * Find jobs by employment type
     * @param {String} employmentType - Employment type
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Jobs with pagination
     */
    async findByEmploymentType(employmentType, options = {}) {
        try {
            const result = await this.findMany(
                { 'type.employment': employmentType, status: 'active' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding jobs by employment type', { 
                error: error.message, 
                employmentType 
            });
            throw error;
        }
    }
    
    /**
     * Find jobs by location
     * @param {String} state - State location
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Jobs with pagination
     */
    async findByLocation(state, options = {}) {
        try {
            const result = await this.findMany(
                { 
                    'location.address.state': state, 
                    status: 'active' 
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding jobs by location', { 
                error: error.message, 
                state 
            });
            throw error;
        }
    }
    
    /**
     * Find remote jobs
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Remote jobs with pagination
     */
    async findRemoteJobs(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    'location.type': { $in: ['remote', 'hybrid'] },
                    status: 'active'
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding remote jobs', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find jobs by experience level
     * @param {String} experienceLevel - Experience level
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Jobs with pagination
     */
    async findByExperienceLevel(experienceLevel, options = {}) {
        try {
            const result = await this.findMany(
                { 'requirements.experience.level': experienceLevel, status: 'active' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding jobs by experience level', { 
                error: error.message, 
                experienceLevel 
            });
            throw error;
        }
    }
    
    /**
     * Search jobs by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchJobs(searchText, options = {}) {
        try {
            const searchCriteria = {
                $text: { $search: searchText },
                status: 'active',
                ...options.criteria
            };
            
            const result = await this.findMany(
                searchCriteria,
                {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { score: { $meta: 'textScore' } },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error searching jobs', { 
                error: error.message, 
                searchText 
            });
            throw error;
        }
    }
    
    /**
     * Find jobs by employer
     * @param {String} employerId - Employer user ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Jobs with pagination
     */
    async findByEmployer(employerId, options = {}) {
        try {
            const result = await this.findMany(
                { employer: employerId },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding jobs by employer', { 
                error: error.message, 
                employerId 
            });
            throw error;
        }
    }
    
    /**
     * Find featured jobs
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Featured jobs with pagination
     */
    async findFeatured(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'active', 
                    featured: true,
                    expiresAt: { $gt: new Date() }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding featured jobs', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find urgent jobs
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Urgent jobs with pagination
     */
    async findUrgent(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'active', 
                    urgent: true,
                    expiresAt: { $gt: new Date() }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding urgent jobs', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find recent jobs
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Recent jobs with pagination
     */
    async findRecent(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'active',
                    expiresAt: { $gt: new Date() }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding recent jobs', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find jobs by salary range
     * @param {Number} minSalary - Minimum salary
     * @param {Number} maxSalary - Maximum salary
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Jobs with pagination
     */
    async findBySalaryRange(minSalary, maxSalary, options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'active',
                    $or: [
                        { 'compensation.salary.min': { $gte: minSalary, $lte: maxSalary } },
                        { 'compensation.salary.max': { $gte: minSalary, $lte: maxSalary } },
                        { 
                            $and: [
                                { 'compensation.salary.min': { $lte: minSalary } },
                                { 'compensation.salary.max': { $gte: maxSalary } }
                            ]
                        }
                    ]
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'compensation.salary.min': -1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding jobs by salary range', { 
                error: error.message,
                minSalary,
                maxSalary
            });
            throw error;
        }
    }
    
    /**
     * Update job application statistics
     * @param {String} jobId - Job ID
     * @param {String} field - Field to increment (applications.count or applications.views)
     * @param {Number} increment - Number to increment by
     * @returns {Promise<Object|null>} Updated job or null
     */
    async updateApplicationStats(jobId, field, increment = 1) {
        try {
            const updateData = {};
            updateData[field] = increment;
            
            if (field === 'applications.count') {
                updateData['applications.lastApplicationDate'] = new Date();
            }
            
            const job = await this.model.findByIdAndUpdate(
                jobId,
                { $inc: updateData },
                { new: true }
            );
            return job;
        } catch (error) {
            logger.error('Error updating job application statistics', { 
                error: error.message, 
                jobId,
                field,
                increment
            });
            throw error;
        }
    }
    
    /**
     * Get job statistics
     * @returns {Promise<Object>} Job statistics
     */
    async getStatistics() {
        try {
            const stats = await this.model.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        byCategory: {
                            $push: '$category.primary'
                        },
                        byEmploymentType: {
                            $push: '$type.employment'
                        },
                        byLocation: {
                            $push: '$location.address.state'
                        },
                        byExperienceLevel: {
                            $push: '$requirements.experience.level'
                        },
                        totalApplications: {
                            $sum: '$applications.count'
                        },
                        totalViews: {
                            $sum: '$applications.views'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        active: 1,
                        byCategory: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byCategory'] },
                                    as: 'category',
                                    in: {
                                        k: '$$category',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byCategory',
                                                    cond: { $eq: ['$$this', '$$category'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byEmploymentType: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byEmploymentType'] },
                                    as: 'employmentType',
                                    in: {
                                        k: '$$employmentType',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byEmploymentType',
                                                    cond: { $eq: ['$$this', '$$employmentType'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byLocation: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byLocation'] },
                                    as: 'location',
                                    in: {
                                        k: '$$location',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byLocation',
                                                    cond: { $eq: ['$$this', '$$location'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byExperienceLevel: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byExperienceLevel'] },
                                    as: 'experienceLevel',
                                    in: {
                                        k: '$$experienceLevel',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byExperienceLevel',
                                                    cond: { $eq: ['$$this', '$$experienceLevel'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        totalApplications: 1,
                        totalViews: 1
                    }
                }
            ]);
            
            return stats[0] || { 
                total: 0, 
                active: 0,
                byCategory: {}, 
                byEmploymentType: {},
                byLocation: {},
                byExperienceLevel: {},
                totalApplications: 0,
                totalViews: 0
            };
        } catch (error) {
            logger.error('Error getting job statistics', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find jobs expiring soon
     * @param {Number} days - Number of days until expiration
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Expiring jobs with pagination
     */
    async findExpiringSoon(days = 7, options = {}) {
        try {
            const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            
            const result = await this.findMany(
                { 
                    status: 'active',
                    expiresAt: { 
                        $gt: new Date(),
                        $lt: expirationDate
                    }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { expiresAt: 1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding expiring jobs', { 
                error: error.message,
                days
            });
            throw error;
        }
    }
    
    /**
     * Find jobs with no applications
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Jobs with pagination
     */
    async findNoApplications(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'active',
                    'applications.count': 0,
                    createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Older than 7 days
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { createdAt: 1 },
                    select: options.select,
                    populate: options.populate || 'employer'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding jobs with no applications', { 
                error: error.message 
            });
            throw error;
        }
    }
}

module.exports = JobRepository;