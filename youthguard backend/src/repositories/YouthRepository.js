/**
 * Youth Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for Youth documents.
 * It extends the BaseRepository and provides youth-specific functionality
 * such as skill management, education tracking, and career development.
 * 
 * Key Features:
 * - Skill and interest management
 * - Education and employment tracking
 * - Portfolio and achievement management
 * - Career development tracking
 * - Youth search and filtering
 */

const BaseRepository = require('./BaseRepository');
const Youth = require('../models/Youth');
const logger = require('../utils/logger');

/**
 * YouthRepository Class
 * 
 * Repository for Youth model with specialized operations.
 */
class YouthRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(Youth);
    }
    
    /**
     * Find youth by user ID
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Youth document or null
     */
    async findByUserId(userId) {
        try {
            const youth = await this.model.findOne({ user: userId });
            return youth;
        } catch (error) {
            logger.error('Error finding youth by user ID', { 
                error: error.message, 
                userId 
            });
            throw error;
        }
    }
    
    /**
     * Find youth by skill
     * @param {String} skill - Skill name
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Youth with pagination
     */
    async findBySkill(skill, options = {}) {
        try {
            const result = await this.findMany(
                { 'skills.name': { $regex: skill, $options: 'i' } },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding youth by skill', { 
                error: error.message, 
                skill 
            });
            throw error;
        }
    }
    
    /**
     * Find youth by interest
     * @param {String} interest - Interest category
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Youth with pagination
     */
    async findByInterest(interest, options = {}) {
        try {
            const result = await this.findMany(
                { interests: { $regex: interest, $options: 'i' } },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding youth by interest', { 
                error: error.message, 
                interest 
            });
            throw error;
        }
    }
    
    /**
     * Find youth by education level
     * @param {String} level - Education level
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Youth with pagination
     */
    async findByEducationLevel(level, options = {}) {
        try {
            const result = await this.findMany(
                { 'education.level': level },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding youth by education level', { 
                error: error.message, 
                level 
            });
            throw error;
        }
    }
    
    /**
     * Find youth by employment status
     * @param {String} status - Employment status
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Youth with pagination
     */
    async findByEmploymentStatus(status, options = {}) {
        try {
            const result = await this.findMany(
                { 'employment.status': status },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding youth by employment status', { 
                error: error.message, 
                status 
            });
            throw error;
        }
    }
    
    /**
     * Search youth by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchYouth(searchText, options = {}) {
        try {
            const searchCriteria = {
                $text: { $search: searchText },
                ...options.criteria
            };
            
            const result = await this.findMany(
                searchCriteria,
                {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { score: { $meta: 'textScore' } },
                    select: options.select
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error searching youth', { 
                error: error.message, 
                searchText 
            });
            throw error;
        }
    }
    
    /**
     * Add skill to youth profile
     * @param {String} youthId - Youth ID
     * @param {Object} skillData - Skill data
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async addSkill(youthId, skillData) {
        try {
            const youth = await this.model.findByIdAndUpdate(
                youthId,
                { $addToSet: { skills: skillData } },
                { new: true }
            );
            return youth;
        } catch (error) {
            logger.error('Error adding skill to youth', { 
                error: error.message, 
                youthId,
                skillData
            });
            throw error;
        }
    }
    
    /**
     * Remove skill from youth profile
     * @param {String} youthId - Youth ID
     * @param {String} skillName - Skill name to remove
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async removeSkill(youthId, skillName) {
        try {
            const youth = await this.model.findByIdAndUpdate(
                youthId,
                { $pull: { skills: { name: skillName } } },
                { new: true }
            );
            return youth;
        } catch (error) {
            logger.error('Error removing skill from youth', { 
                error: error.message, 
                youthId,
                skillName
            });
            throw error;
        }
    }
    
    /**
     * Update skill level for youth
     * @param {String} youthId - Youth ID
     * @param {String} skillName - Skill name
     * @param {String} newLevel - New skill level
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async updateSkillLevel(youthId, skillName, newLevel) {
        try {
            const youth = await this.model.findOneAndUpdate(
                { _id: youthId, 'skills.name': skillName },
                { $set: { 'skills.$.level': newLevel } },
                { new: true }
            );
            return youth;
        } catch (error) {
            logger.error('Error updating skill level for youth', { 
                error: error.message, 
                youthId,
                skillName,
                newLevel
            });
            throw error;
        }
    }
    
    /**
     * Add interest to youth profile
     * @param {String} youthId - Youth ID
     * @param {String} interest - Interest to add
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async addInterest(youthId, interest) {
        try {
            const youth = await this.model.findByIdAndUpdate(
                youthId,
                { $addToSet: { interests: interest } },
                { new: true }
            );
            return youth;
        } catch (error) {
            logger.error('Error adding interest to youth', { 
                error: error.message, 
                youthId,
                interest
            });
            throw error;
        }
    }
    
    /**
     * Remove interest from youth profile
     * @param {String} youthId - Youth ID
     * @param {String} interest - Interest to remove
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async removeInterest(youthId, interest) {
        try {
            const youth = await this.model.findByIdAndUpdate(
                youthId,
                { $pull: { interests: interest } },
                { new: true }
            );
            return youth;
        } catch (error) {
            logger.error('Error removing interest from youth', { 
                error: error.message, 
                youthId,
                interest
            });
            throw error;
        }
    }
    
    /**
     * Add achievement to youth profile
     * @param {String} youthId - Youth ID
     * @param {Object} achievementData - Achievement data
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async addAchievement(youthId, achievementData) {
        try {
            const youth = await this.model.findByIdAndUpdate(
                youthId,
                { $push: { achievements: achievementData } },
                { new: true }
            );
            return youth;
        } catch (error) {
            logger.error('Error adding achievement to youth', { 
                error: error.message, 
                youthId,
                achievementData
            });
            throw error;
        }
    }
    
    /**
     * Add portfolio item to youth profile
     * @param {String} youthId - Youth ID
     * @param {Object} portfolioData - Portfolio data
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async addPortfolioItem(youthId, portfolioData) {
        try {
            const youth = await this.model.findByIdAndUpdate(
                youthId,
                { $push: { portfolio: portfolioData } },
                { new: true }
            );
            return youth;
        } catch (error) {
            logger.error('Error adding portfolio item to youth', { 
                error: error.message, 
                youthId,
                portfolioData
            });
            throw error;
        }
    }
    
    /**
     * Update employment status for youth
     * @param {String} youthId - Youth ID
     * @param {Object} employmentData - Employment data
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async updateEmployment(youthId, employmentData) {
        try {
            const youth = await this.update(youthId, {
                employment: employmentData
            });
            return youth;
        } catch (error) {
            logger.error('Error updating employment for youth', { 
                error: error.message, 
                youthId,
                employmentData
            });
            throw error;
        }
    }
    
    /**
     * Update education for youth
     * @param {String} youthId - Youth ID
     * @param {Object} educationData - Education data
     * @returns {Promise<Object|null>} Updated youth or null
     */
    async updateEducation(youthId, educationData) {
        try {
            const youth = await this.update(youthId, {
                education: educationData
            });
            return youth;
        } catch (error) {
            logger.error('Error updating education for youth', { 
                error: error.message, 
                youthId,
                educationData
            });
            throw error;
        }
    }
    
    /**
     * Get youth statistics
     * @returns {Promise<Object>} Youth statistics
     */
    async getStatistics() {
        try {
            const stats = await this.model.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        byEducationLevel: {
                            $push: '$education.level'
                        },
                        byEmploymentStatus: {
                            $push: '$employment.status'
                        },
                        byLocation: {
                            $push: '$location.state'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        byEducationLevel: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byEducationLevel'] },
                                    as: 'level',
                                    in: {
                                        k: '$$level',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byEducationLevel',
                                                    cond: { $eq: ['$$this', '$$level'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byEmploymentStatus: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byEmploymentStatus'] },
                                    as: 'status',
                                    in: {
                                        k: '$$status',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byEmploymentStatus',
                                                    cond: { $eq: ['$$this', '$$status'] }
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
                        }
                    }
                }
            ]);
            
            return stats[0] || { 
                total: 0, 
                byEducationLevel: {}, 
                byEmploymentStatus: {},
                byLocation: {}
            };
        } catch (error) {
            logger.error('Error getting youth statistics', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find youth with specific skills
     * @param {Array} skills - Array of skill names
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Youth with pagination
     */
    async findBySkills(skills, options = {}) {
        try {
            const result = await this.findMany(
                { 'skills.name': { $in: skills } },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding youth by skills', { 
                error: error.message, 
                skills 
            });
            throw error;
        }
    }
    
    /**
     * Find youth ready for employment (completed courses, has skills)
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Ready youth with pagination
     */
    async findEmploymentReady(options = {}) {
        try {
            const result = await this.findMany(
                {
                    'skills.0': { $exists: true }, // Has at least one skill
                    'education.level': { $ne: 'none' }, // Has some education
                    'employment.status': { $in: ['unemployed', 'seeking'] }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding employment-ready youth', { 
                error: error.message 
            });
            throw error;
        }
    }
}

module.exports = YouthRepository;