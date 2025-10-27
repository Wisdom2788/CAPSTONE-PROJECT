/**
 * Enrollment Service for YouthGuard MVP
 * 
 * This service handles all business logic related to course enrollments.
 */

const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const SimpleUser = require('../models/SimpleUser');

class EnrollmentService {
    /**
     * Enroll user in a course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Object>} Enrollment data
     */
    async enrollInCourse(userId, courseId) {
        try {
            // Check if course exists and is active
            const course = await Course.findById(courseId);
            if (!course || !course.isActive) {
                throw new Error('Course not found or not available');
            }

            // Check if user exists
            const user = await SimpleUser.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Check if already enrolled
            const existingEnrollment = await Enrollment.findOne({
                userId,
                courseId,
                isActive: true
            });

            if (existingEnrollment) {
                throw new Error('Already enrolled in this course');
            }

            // Create enrollment
            const enrollment = new Enrollment({
                userId,
                courseId,
                status: 'active'
            });

            const savedEnrollment = await enrollment.save();

            // Update course enrollment count
            await Course.findByIdAndUpdate(
                courseId,
                { $inc: { enrollmentCount: 1 } }
            );

            // Populate course and user data for response
            const populatedEnrollment = await Enrollment.findById(savedEnrollment._id)
                .populate('courseId', 'title description category instructor duration difficulty thumbnail')
                .populate('userId', 'firstName lastName email');

            return populatedEnrollment;
        } catch (error) {
            throw new Error(`Failed to enroll in course: ${error.message}`);
        }
    }

    /**
     * Unenroll user from a course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Boolean>} Success status
     */
    async unenrollFromCourse(userId, courseId) {
        try {
            const enrollment = await Enrollment.findOne({
                userId,
                courseId,
                isActive: true
            });

            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            // Soft delete enrollment
            enrollment.isActive = false;
            enrollment.status = 'dropped';
            await enrollment.save();

            // Update course enrollment count
            await Course.findByIdAndUpdate(
                courseId,
                { $inc: { enrollmentCount: -1 } }
            );

            return true;
        } catch (error) {
            throw new Error(`Failed to unenroll from course: ${error.message}`);
        }
    }

    /**
     * Check if user is enrolled in a course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Object|null>} Enrollment data or null
     */
    async checkEnrollmentStatus(userId, courseId) {
        try {
            const enrollment = await Enrollment.findOne({
                userId,
                courseId,
                isActive: true
            }).populate('courseId', 'title');

            return enrollment;
        } catch (error) {
            throw new Error(`Failed to check enrollment status: ${error.message}`);
        }
    }

    /**
     * Get all enrollments for a user
     * @param {String} userId - User ID
     * @param {String} status - Optional status filter
     * @returns {Promise<Array>} List of enrollments
     */
    async getUserEnrollments(userId, status = null) {
        try {
            const query = { userId, isActive: true };
            if (status) {
                query.status = status;
            }

            const enrollments = await Enrollment.find(query)
                .populate('courseId', 'title description category instructor duration difficulty thumbnail rating')
                .sort({ enrollmentDate: -1 });

            return enrollments;
        } catch (error) {
            throw new Error(`Failed to fetch user enrollments: ${error.message}`);
        }
    }

    /**
     * Get all enrollments for a course
     * @param {String} courseId - Course ID
     * @param {String} status - Optional status filter
     * @returns {Promise<Array>} List of enrollments
     */
    async getCourseEnrollments(courseId, status = null) {
        try {
            const query = { courseId, isActive: true };
            if (status) {
                query.status = status;
            }

            const enrollments = await Enrollment.find(query)
                .populate('userId', 'firstName lastName email')
                .sort({ enrollmentDate: -1 });

            return enrollments;
        } catch (error) {
            throw new Error(`Failed to fetch course enrollments: ${error.message}`);
        }
    }

    /**
     * Update enrollment progress
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @param {Number} progressPercentage - Progress percentage (0-100)
     * @returns {Promise<Object>} Updated enrollment
     */
    async updateProgress(userId, courseId, progressPercentage) {
        try {
            const enrollment = await Enrollment.findOne({
                userId,
                courseId,
                isActive: true
            });

            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            enrollment.progressPercentage = Math.min(100, Math.max(0, progressPercentage));
            enrollment.lastAccessedAt = new Date();

            // Mark as completed if 100%
            if (enrollment.progressPercentage === 100 && enrollment.status !== 'completed') {
                enrollment.status = 'completed';
                enrollment.completionDate = new Date();
            }

            const updatedEnrollment = await enrollment.save();
            return updatedEnrollment;
        } catch (error) {
            throw new Error(`Failed to update progress: ${error.message}`);
        }
    }

    /**
     * Get enrollment statistics for a course
     * @param {String} courseId - Course ID
     * @returns {Promise<Object>} Enrollment statistics
     */
    async getCourseStats(courseId) {
        try {
            const stats = await Enrollment.aggregate([
                { $match: { courseId: new mongoose.Types.ObjectId(courseId), isActive: true } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgProgress: { $avg: '$progressPercentage' }
                    }
                }
            ]);

            const totalEnrollments = await Enrollment.countDocuments({
                courseId,
                isActive: true
            });

            return {
                totalEnrollments,
                statusBreakdown: stats,
                lastUpdated: new Date()
            };
        } catch (error) {
            throw new Error(`Failed to fetch course statistics: ${error.message}`);
        }
    }
}

module.exports = EnrollmentService;