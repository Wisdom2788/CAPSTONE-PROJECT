/**
 * Course Service for YouthGuard MVP
 * 
 * This service handles all business logic related to courses.
 */

const Course = require('../models/Course');

class CourseService {
    /**
     * Create a new course
     * @param {Object} courseData - Course data
     * @returns {Promise<Object>} Created course
     */
    async createCourse(courseData) {
        try {
            const course = new Course(courseData);
            const savedCourse = await course.save();
            return savedCourse;
        } catch (error) {
            throw new Error(`Failed to create course: ${error.message}`);
        }
    }

    /**
     * Get all courses
     * @returns {Promise<Array>} List of courses
     */
    async getAllCourses() {
        try {
            const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
            return courses;
        } catch (error) {
            throw new Error(`Failed to fetch courses: ${error.message}`);
        }
    }

    /**
     * Get limited number of courses (for dashboard)
     * @param {Number} limit - Number of courses to return
     * @returns {Promise<Array>} Limited list of courses
     */
    async getLimitedCourses(limit = 5) {
        try {
            const courses = await Course.find({ isActive: true })
                .sort({ rating: -1, createdAt: -1 })
                .limit(limit);
            return courses;
        } catch (error) {
            throw new Error(`Failed to fetch limited courses: ${error.message}`);
        }
    }

    /**
     * Get course by ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Object>} Course data
     */
    async getCourseById(courseId) {
        try {
            const course = await Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        } catch (error) {
            throw new Error(`Failed to fetch course: ${error.message}`);
        }
    }

    /**
     * Update course
     * @param {String} courseId - Course ID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated course
     */
    async updateCourse(courseId, updateData) {
        try {
            const course = await Course.findByIdAndUpdate(
                courseId,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!course) {
                throw new Error('Course not found');
            }

            return course;
        } catch (error) {
            throw new Error(`Failed to update course: ${error.message}`);
        }
    }

    /**
     * Delete course
     * @param {String} courseId - Course ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteCourse(courseId) {
        try {
            const course = await Course.findByIdAndUpdate(
                courseId,
                { isActive: false, updatedAt: new Date() },
                { new: true }
            );

            if (!course) {
                throw new Error('Course not found');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete course: ${error.message}`);
        }
    }

    /**
     * Search courses by title or instructor
     * @param {String} query - Search query
     * @returns {Promise<Array>} List of matching courses
     */
    async searchCourses(query) {
        try {
            const courses = await Course.find({
                isActive: true,
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { instructor: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            }).sort({ createdAt: -1 });

            return courses;
        } catch (error) {
            throw new Error(`Failed to search courses: ${error.message}`);
        }
    }
}

module.exports = CourseService;
