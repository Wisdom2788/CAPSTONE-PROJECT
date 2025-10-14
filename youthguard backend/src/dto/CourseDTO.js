/**
 * Course Data Transfer Object (DTO) - YouthGuard Platform
 * 
 * This DTO controls the data transfer for Course entities between layers.
 * It ensures only necessary data is exposed and provides validation.
 */

const BaseDTO = require('./BaseDTO');

/**
 * CourseDTO Class
 * 
 * DTO for Course entity with validation and transformation methods.
 */
class CourseDTO extends BaseDTO {
    /**
     * Constructor
     * @param {Object} data - Course data
     */
    constructor(data = {}) {
        super(data);
        this._validateData();
    }
    
    /**
     * Validate course data
     * @private
     */
    _validateData() {
        const errors = [];
        
        // Validate required fields
        if (!this._data.title || this._data.title.trim().length === 0) {
            errors.push('Course title is required');
        }
        
        if (!this._data.description || this._data.description.trim().length === 0) {
            errors.push('Course description is required');
        }
        
        if (!this._data.category || this._data.category.trim().length === 0) {
            errors.push('Course category is required');
        }
        
        if (this._data.instructor && typeof this._data.instructor !== 'string') {
            errors.push('Instructor must be a string');
        }
        
        if (this._data.duration && (typeof this._data.duration !== 'number' || this._data.duration <= 0)) {
            errors.push('Duration must be a positive number');
        }
        
        if (this._data.level && !['beginner', 'intermediate', 'advanced'].includes(this._data.level)) {
            errors.push('Invalid course level');
        }
        
        if (this._data.price && (typeof this._data.price !== 'number' || this._data.price < 0)) {
            errors.push('Price must be a non-negative number');
        }
        
        if (this._data.lessons && !Array.isArray(this._data.lessons)) {
            errors.push('Lessons must be an array');
        }
        
        if (errors.length > 0) {
            throw new Error(`Validation errors: ${errors.join(', ')}`);
        }
    }
    
    /**
     * Transform DTO for public API response
     * @returns {Object} Public course data
     */
    toPublicResponse() {
        return {
            id: this._data._id || this._data.id,
            title: this._data.title,
            description: this._data.description,
            category: this._data.category,
            instructor: this._data.instructor,
            duration: this._data.duration,
            level: this._data.level,
            price: this._data.price,
            thumbnail: this._data.thumbnail,
            lessons: this._data.lessons || [],
            rating: this._data.rating,
            enrollmentCount: this._data.enrollmentCount,
            status: this._data.status,
            createdAt: this._data.createdAt,
            updatedAt: this._data.updatedAt
        };
    }
    
    /**
     * Transform DTO for course creation
     * @returns {Object} Course creation data
     */
    toCreation() {
        return {
            title: this._data.title,
            description: this._data.description,
            category: this._data.category,
            instructor: this._data.instructor,
            duration: this._data.duration,
            level: this._data.level,
            price: this._data.price,
            thumbnail: this._data.thumbnail,
            lessons: this._data.lessons || [],
            status: this._data.status || 'draft'
        };
    }
    
    /**
     * Transform DTO for course update
     * @returns {Object} Course update data
     */
    toUpdate() {
        const updateData = {};
        
        // Only include fields that are present
        const fields = ['title', 'description', 'category', 'instructor', 'duration', 
                       'level', 'price', 'thumbnail', 'lessons', 'status'];
        
        fields.forEach(field => {
            if (this._data[field] !== undefined) {
                updateData[field] = this._data[field];
            }
        });
        
        return updateData;
    }
    
    /**
     * Create DTO from course model
     * @static
     * @param {Object} course - Course model instance
     * @returns {CourseDTO} Course DTO instance
     */
    static fromModel(course) {
        return new CourseDTO({
            _id: course._id,
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category,
            instructor: course.instructor,
            duration: course.duration,
            level: course.level,
            price: course.price,
            thumbnail: course.thumbnail,
            lessons: course.lessons,
            rating: course.rating,
            enrollmentCount: course.enrollmentCount,
            status: course.status,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt
        });
    }
}

module.exports = CourseDTO;