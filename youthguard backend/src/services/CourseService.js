/**
 * Course Service for YouthGuard MVP
 * 
 * This service handles all business logic related to courses.
 */

const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

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
     * Add lesson to course
     * @param {String} courseId - Course ID
     * @param {Object} lessonData - Lesson data
     * @returns {Promise<Object>} Created lesson
     */
    async addLesson(courseId, lessonData) {
        try {
            // Verify course exists
            const course = await Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            // Create lesson
            const lesson = new Lesson({
                courseId,
                ...lessonData
            });
            
            const savedLesson = await lesson.save();
            
            return savedLesson;
        } catch (error) {
            throw new Error(`Failed to add lesson: ${error.message}`);
        }
    }

    /**
     * Get lessons for course
     * @param {String} courseId - Course ID
     * @returns {Promise<Array>} List of lessons
     */
    async getLessonsForCourse(courseId) {
        try {
            const lessons = await Lesson.find({ courseId }).sort({ orderIndex: 1 });
            return lessons;
        } catch (error) {
            throw new Error(`Failed to fetch lessons: ${error.message}`);
        }
    }
}

module.exports = CourseService;
