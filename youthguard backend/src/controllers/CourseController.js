/**
 * Course Controller for YouthGuard MVP
 * 
 * This controller handles all HTTP requests related to courses.
 */

const CourseService = require('../services/CourseService');

class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }

    /**
     * Create a new course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async createCourse(req, res) {
        try {
            const course = await this.courseService.createCourse(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: course
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all courses
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAllCourses(req, res) {
        try {
            const courses = await this.courseService.getAllCourses();
            
            res.status(200).json({
                success: true,
                message: 'Courses retrieved successfully',
                data: courses
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get course by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCourseById(req, res) {
        try {
            const { id } = req.params;
            const course = await this.courseService.getCourseById(id);
            
            res.status(200).json({
                success: true,
                message: 'Course retrieved successfully',
                data: course
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const course = await this.courseService.updateCourse(id, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Course updated successfully',
                data: course
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            await this.courseService.deleteCourse(id);
            
            res.status(200).json({
                success: true,
                message: 'Course deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


}

module.exports = CourseController;
