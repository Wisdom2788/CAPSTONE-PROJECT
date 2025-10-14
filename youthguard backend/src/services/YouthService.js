/**
 * Youth Service - YouthGuard Platform
 * 
 * This service handles all business logic related to Youth management.
 * It extends the BaseService and provides youth-specific functionality
 * such as skill management, education tracking, and career development.
 * 
 * Key Features:
 * - Youth profile management
 * - Skill and interest management
 * - Education and employment tracking
 * - Portfolio and achievement management
 * - Career development tracking
 */

const BaseService = require('./BaseService');
const YouthRepository = require('../repositories/YouthRepository');
const logger = require('../utils/logger');

/**
 * YouthService Class
 * 
 * Service for Youth model with specialized business logic.
 */
class YouthService extends BaseService {
    /**
     * Constructor
     */
    constructor() {
        super(new YouthRepository());
    }
    
    /**
     * Create youth profile
     * @param {Object} youthData - Youth profile data
     * @returns {Promise<Object>} Created youth profile
     */
    async createYouthProfile(youthData) {
        try {
            logger.info('Creating youth profile', { userId: youthData.user });
            
            // Prepare youth data
            const youth = {
                user: youthData.user,
                dateOfBirth: youthData.dateOfBirth,
                gender: youthData.gender,
                phone: youthData.phone,
                location: youthData.location,
                education: youthData.education,
                employment: youthData.employment,
                skills: youthData.skills || [],
                interests: youthData.interests || [],
                bio: youthData.bio,
                profilePicture: youthData.profilePicture,
                socialLinks: youthData.socialLinks,
                achievements: youthData.achievements || [],
                portfolio: youthData.portfolio || []
            };
            
            // Create youth profile through repository
            const createdYouth = await this.repository.create(youth);
            
            logger.info('Youth profile created successfully', { youthId: createdYouth._id });
            return createdYouth;
            
        } catch (error) {
            logger.error('Error creating youth profile', { 
                error: error.message, 
                userId: youthData.user 
            });
            throw error;
        }
    }
    
    /**
     * Update youth profile
     * @param {String} youthId - Youth ID
     * @param {Object} profileData - Profile update data
     * @returns {Promise<Object>} Updated youth profile
     */
    async updateYouthProfile(youthId, profileData) {
        try {
            logger.info('Updating youth profile', { youthId });
            
            // Prepare update data
            const updateData = {
                phone: profileData.phone,
                location: profileData.location,
                bio: profileData.bio,
                profilePicture: profileData.profilePicture,
                socialLinks: profileData.socialLinks
            };
            
            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });
            
            // Update youth profile through repository
            const youth = await this.repository.update(youthId, updateData);
            
            logger.info('Youth profile updated successfully', { youthId });
            return youth;
            
        } catch (error) {
            logger.error('Error updating youth profile', { 
                error: error.message, 
                youthId 
            });
            throw error;
        }
    }
    
    /**
     * Update youth education
     * @param {String} youthId - Youth ID
     * @param {Object} educationData - Education data
     * @returns {Promise<Object>} Updated youth profile
     */
    async updateEducation(youthId, educationData) {
        try {
            logger.info('Updating youth education', { youthId });
            
            const youth = await this.repository.updateEducation(youthId, educationData);
            
            logger.info('Youth education updated successfully', { youthId });
            return youth;
            
        } catch (error) {
            logger.error('Error updating youth education', { 
                error: error.message, 
                youthId 
            });
            throw error;
        }
    }
    
    /**
     * Update youth employment
     * @param {String} youthId - Youth ID
     * @param {Object} employmentData - Employment data
     * @returns {Promise<Object>} Updated youth profile
     */
    async updateEmployment(youthId, employmentData) {
        try {
            logger.info('Updating youth employment', { youthId });
            
            const youth = await this.repository.updateEmployment(youthId, employmentData);
            
            logger.info('Youth employment updated successfully', { youthId });
            return youth;
            
        } catch (error) {
            logger.error('Error updating youth employment', { 
                error: error.message, 
                youthId 
            });
            throw error;
        }
    }
    
    /**
     * Add skill to youth profile
     * @param {String} youthId - Youth ID
     * @param {Object} skillData - Skill data
     * @returns {Promise<Object>} Updated youth profile
     */
    async addSkill(youthId, skillData) {
        try {
            logger.info('Adding skill to youth profile', { youthId, skill: skillData.name });
            
            const youth = await this.repository.addSkill(youthId, skillData);
            
            logger.info('Skill added to youth profile successfully', { youthId, skill: skillData.name });
            return youth;
            
        } catch (error) {
            logger.error('Error adding skill to youth profile', { 
                error: error.message, 
                youthId,
                skill: skillData.name
            });
            throw error;
        }
    }
    
    /**
     * Remove skill from youth profile
     * @param {String} youthId - Youth ID
     * @param {String} skillName - Skill name
     * @returns {Promise<Object>} Updated youth profile
     */
    async removeSkill(youthId, skillName) {
        try {
            logger.info('Removing skill from youth profile', { youthId, skill: skillName });
            
            const youth = await this.repository.removeSkill(youthId, skillName);
            
            logger.info('Skill removed from youth profile successfully', { youthId, skill: skillName });
            return youth;
            
        } catch (error) {
            logger.error('Error removing skill from youth profile', { 
                error: error.message, 
                youthId,
                skill: skillName
            });
            throw error;
        }
    }
    
    /**
     * Update skill level
     * @param {String} youthId - Youth ID
     * @param {String} skillName - Skill name
     * @param {String} newLevel - New skill level
     * @returns {Promise<Object>} Updated youth profile
     */
    async updateSkillLevel(youthId, skillName, newLevel) {
        try {
            logger.info('Updating skill level for youth', { youthId, skill: skillName, level: newLevel });
            
            const youth = await this.repository.updateSkillLevel(youthId, skillName, newLevel);
            
            logger.info('Skill level updated successfully', { youthId, skill: skillName, level: newLevel });
            return youth;
            
        } catch (error) {
            logger.error('Error updating skill level', { 
                error: error.message, 
                youthId,
                skill: skillName,
                level: newLevel
            });
            throw error;
        }
    }
    
    /**
     * Add interest to youth profile
     * @param {String} youthId - Youth ID
     * @param {String} interest - Interest to add
     * @returns {Promise<Object>} Updated youth profile
     */
    async addInterest(youthId, interest) {
        try {
            logger.info('Adding interest to youth profile', { youthId, interest });
            
            const youth = await this.repository.addInterest(youthId, interest);
            
            logger.info('Interest added to youth profile successfully', { youthId, interest });
            return youth;
            
        } catch (error) {
            logger.error('Error adding interest to youth profile', { 
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
     * @returns {Promise<Object>} Updated youth profile
     */
    async removeInterest(youthId, interest) {
        try {
            logger.info('Removing interest from youth profile', { youthId, interest });
            
            const youth = await this.repository.removeInterest(youthId, interest);
            
            logger.info('Interest removed from youth profile successfully', { youthId, interest });
            return youth;
            
        } catch (error) {
            logger.error('Error removing interest from youth profile', { 
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
     * @returns {Promise<Object>} Updated youth profile
     */
    async addAchievement(youthId, achievementData) {
        try {
            logger.info('Adding achievement to youth profile', { youthId, achievement: achievementData.title });
            
            const youth = await this.repository.addAchievement(youthId, achievementData);
            
            logger.info('Achievement added to youth profile successfully', { youthId, achievement: achievementData.title });
            return youth;
            
        } catch (error) {
            logger.error('Error adding achievement to youth profile', { 
                error: error.message, 
                youthId,
                achievement: achievementData.title
            });
            throw error;
        }
    }
    
    /**
     * Add portfolio item to youth profile
     * @param {String} youthId - Youth ID
     * @param {Object} portfolioData - Portfolio data
     * @returns {Promise<Object>} Updated youth profile
     */
    async addPortfolioItem(youthId, portfolioData) {
        try {
            logger.info('Adding portfolio item to youth profile', { youthId });
            
            const youth = await this.repository.addPortfolioItem(youthId, portfolioData);
            
            logger.info('Portfolio item added to youth profile successfully', { youthId });
            return youth;
            
        } catch (error) {
            logger.error('Error adding portfolio item to youth profile', { 
                error: error.message, 
                youthId
            });
            throw error;
        }
    }
    
    /**
     * Search youth profiles
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results
     */
    async searchYouth(searchText, options = {}) {
        try {
            logger.info('Searching youth profiles', { searchText });
            
            const result = await this.repository.searchYouth(searchText, options);
            
            logger.info('Youth profiles search completed', { 
                searchText, 
                count: result.documents.length 
            });
            
            return result;
            
        } catch (error) {
            logger.error('Error searching youth profiles', { 
                error: error.message, 
                searchText 
            });
            throw error;
        }
    }
    
    /**
     * Find youth by skills
     * @param {Array} skills - Array of skill names
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Youth profiles
     */
    async findBySkills(skills, options = {}) {
        try {
            logger.info('Finding youth by skills', { skills });
            
            const result = await this.repository.findBySkills(skills, options);
            
            logger.info('Youth by skills search completed', { 
                skills, 
                count: result.documents.length 
            });
            
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
     * Get youth statistics
     * @returns {Promise<Object>} Youth statistics
     */
    async getStatistics() {
        try {
            logger.info('Getting youth statistics');
            
            const stats = await this.repository.getStatistics();
            
            logger.info('Youth statistics retrieved');
            return stats;
            
        } catch (error) {
            logger.error('Error getting youth statistics', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find employment-ready youth
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Employment-ready youth
     */
    async findEmploymentReady(options = {}) {
        try {
            logger.info('Finding employment-ready youth');
            
            const result = await this.repository.findEmploymentReady(options);
            
            logger.info('Employment-ready youth search completed', { 
                count: result.documents.length 
            });
            
            return result;
            
        } catch (error) {
            logger.error('Error finding employment-ready youth', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Transform youth entity for output
     * @protected
     * @param {Object} youth - Youth entity
     * @returns {Promise<Object>} Transformed youth
     */
    async _transformEntity(youth) {
        // Remove sensitive information if any
        const transformedYouth = { ...youth.toObject() };
        delete transformedYouth.__v;
        
        return transformedYouth;
    }
}

module.exports = YouthService;