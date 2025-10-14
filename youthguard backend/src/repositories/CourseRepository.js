/**
 * Course Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for Course documents.
 * It extends the BaseRepository and provides course-specific functionality
 * such as enrollment management, content organization, and learning analytics.
 * 
 * Key Features:
 * - Course search and filtering
 * - Enrollment management
 * - Content organization
 * - Rating and review management
 * - Course analytics
 * - Category and tag management
 */

const BaseRepository = require('./BaseRepository');
const Course = require('../models/Course');
const logger = require('../utils/logger');

/**
 * CourseRepository Class
 * 
 * Repository for Course model with specialized operations.
 */
class CourseRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(Course);
    }
    
    /**
     * Find courses by category
     * @param {String} category - Primary category
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Courses with pagination
     */
    async findByCategory(category, options = {}) {
        try {
            const result = await this.findMany(
                { 'category.primary': category, status: 'published' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding courses by category', { 
                error: error.message, 
                category 
            });
            throw error;
        }
    }
    
    /**
     * Find courses by level
     * @param {String} level - Course level (beginner, intermediate, advanced)
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Courses with pagination
     */
    async findByLevel(level, options = {}) {
        try {
            const result = await this.findMany(
                { level: level, status: 'published' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding courses by level', { 
                error: error.message, 
                level 
            });
            throw error;
        }
    }
    
    /**
     * Find courses by instructor
     * @param {String} instructorId - Instructor user ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Courses with pagination
     */
    async findByInstructor(instructorId, options = {}) {
        try {
            const result = await this.findMany(
                { instructor: instructorId },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding courses by instructor', { 
                error: error.message, 
                instructorId 
            });
            throw error;
        }
    }
    
    /**
     * Search courses by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchCourses(searchText, options = {}) {
        try {
            const searchCriteria = {
                $text: { $search: searchText },
                status: 'published',
                ...options.criteria
            };
            
            const result = await this.findMany(
                searchCriteria,
                {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { score: { $meta: 'textScore' } },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error searching courses', { 
                error: error.message, 
                searchText 
            });
            throw error;
        }
    }
    
    /**
     * Find courses by tag
     * @param {String} tag - Tag to search for
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Courses with pagination
     */
    async findByTag(tag, options = {}) {
        try {
            const result = await this.findMany(
                { tags: tag, status: 'published' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding courses by tag', { 
                error: error.message, 
                tag 
            });
            throw error;
        }
    }
    
    /**
     * Find featured courses
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Featured courses with pagination
     */
    async findFeatured(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'published', 
                    featured: true,
                    publishedAt: { $lte: new Date() }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { publishedAt: -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding featured courses', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find popular courses (by enrollment count)
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Popular courses with pagination
     */
    async findPopular(options = {}) {
        try {
            const result = await this.findMany(
                { status: 'published' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'enrollment.enrolled': -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding popular courses', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find recently published courses
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Recent courses with pagination
     */
    async findRecent(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'published',
                    publishedAt: { $lte: new Date() }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { publishedAt: -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding recent courses', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find courses by price type
     * @param {String} priceType - Price type (free, paid, freemium)
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Courses with pagination
     */
    async findByPriceType(priceType, options = {}) {
        try {
            const result = await this.findMany(
                { 'pricing.type': priceType, status: 'published' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding courses by price type', { 
                error: error.message, 
                priceType 
            });
            throw error;
        }
    }
    
    /**
     * Add a lesson to a course
     * @param {String} courseId - Course ID
     * @param {Object} lessonData - Lesson data
     * @returns {Promise<Object|null>} Updated course or null
     */
    async addLesson(courseId, lessonData) {
        try {
            const course = await this.model.findByIdAndUpdate(
                courseId,
                { $push: { lessons: lessonData } },
                { new: true }
            );
            return course;
        } catch (error) {
            logger.error('Error adding lesson to course', { 
                error: error.message, 
                courseId,
                lessonData
            });
            throw error;
        }
    }
    
    /**
     * Remove a lesson from a course
     * @param {String} courseId - Course ID
     * @param {String} lessonId - Lesson ID
     * @returns {Promise<Object|null>} Updated course or null
     */
    async removeLesson(courseId, lessonId) {
        try {
            const course = await this.model.findByIdAndUpdate(
                courseId,
                { $pull: { lessons: { _id: lessonId } } },
                { new: true }
            );
            return course;
        } catch (error) {
            logger.error('Error removing lesson from course', { 
                error: error.message, 
                courseId,
                lessonId
            });
            throw error;
        }
    }
    
    /**
     * Update enrollment statistics for a course
     * @param {String} courseId - Course ID
     * @param {Number} increment - Number to increment by (can be negative)
     * @returns {Promise<Object|null>} Updated course or null
     */
    async updateEnrollmentCount(courseId, increment = 1) {
        try {
            const course = await this.model.findByIdAndUpdate(
                courseId,
                { 
                    $inc: { 'enrollment.enrolled': increment },
                    'enrollment.lastUpdated': new Date()
                },
                { new: true }
            );
            return course;
        } catch (error) {
            logger.error('Error updating enrollment count for course', { 
                error: error.message, 
                courseId,
                increment
            });
            throw error;
        }
    }
    
    /**
     * Add a rating to a course
     * @param {String} courseId - Course ID
     * @param {Object} ratingData - Rating data
     * @returns {Promise<Object|null>} Updated course or null
     */
    async addRating(courseId, ratingData) {
        try {
            // This would typically be handled in a separate Rating model
            // For now, we'll update the course's ratings field
            const course = await this.findById(courseId);
            if (!course) return null;
            
            // Update ratings distribution
            const ratingField = `${ratingData.score}`;
            course.ratings.distribution[ratingField] += 1;
            course.ratings.count += 1;
            
            // Recalculate average
            let totalPoints = 0;
            let totalCount = 0;
            
            Object.keys(course.ratings.distribution).forEach(key => {
                const count = course.ratings.distribution[key];
                totalPoints += parseInt(key) * count;
                totalCount += count;
            });
            
            course.ratings.average = totalCount > 0 ? totalPoints / totalCount : 0;
            
            await course.save();
            return course;
        } catch (error) {
            logger.error('Error adding rating to course', { 
                error: error.message, 
                courseId,
                ratingData
            });
            throw error;
        }
    }
    
    /**
     * Get course statistics
     * @returns {Promise<Object>} Course statistics
     */
    async getStatistics() {
        try {
            const stats = await this.model.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        published: {
                            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
                        },
                        draft: {
                            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
                        },
                        archived: {
                            $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
                        },
                        byCategory: {
                            $push: '$category.primary'
                        },
                        byLevel: {
                            $push: '$level'
                        },
                        byPriceType: {
                            $push: '$pricing.type'
                        },
                        totalEnrollments: {
                            $sum: '$enrollment.enrolled'
                        },
                        averageRating: {
                            $avg: '$ratings.average'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        published: 1,
                        draft: 1,
                        archived: 1,
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
                        byLevel: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byLevel'] },
                                    as: 'level',
                                    in: {
                                        k: '$$level',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byLevel',
                                                    cond: { $eq: ['$$this', '$$level'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byPriceType: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byPriceType'] },
                                    as: 'priceType',
                                    in: {
                                        k: '$$priceType',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byPriceType',
                                                    cond: { $eq: ['$$this', '$$priceType'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        totalEnrollments: 1,
                        averageRating: { $round: ['$averageRating', 2] }
                    }
                }
            ]);
            
            return stats[0] || { 
                total: 0, 
                published: 0,
                draft: 0,
                archived: 0,
                byCategory: {}, 
                byLevel: {},
                byPriceType: {},
                totalEnrollments: 0,
                averageRating: 0
            };
        } catch (error) {
            logger.error('Error getting course statistics', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find courses with low enrollment (for promotional purposes)
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Courses with pagination
     */
    async findLowEnrollment(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    status: 'published',
                    'enrollment.enrolled': { $lt: 10 } // Less than 10 enrollments
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'enrollment.enrolled': 1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding low enrollment courses', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find courses by secondary category
     * @param {String} subcategory - Secondary category
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Courses with pagination
     */
    async findBySubcategory(subcategory, options = {}) {
        try {
            const result = await this.findMany(
                { 
                    'category.secondary': subcategory, 
                    status: 'published' 
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'instructor'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding courses by subcategory', { 
                error: error.message, 
                subcategory 
            });
            throw error;
        }
    }
}

module.exports = CourseRepository;