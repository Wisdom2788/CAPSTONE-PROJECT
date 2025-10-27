/**
 * Enrollment Controller for YouthGuard MVP
 * 
 * This controller handles all HTTP requests related to course enrollments.
 */

class EnrollmentController {
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    /**
     * Enroll user in a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async enrollInCourse(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.userId; // From auth middleware

            const enrollment = await this.enrollmentService.enrollInCourse(userId, courseId);
            
            res.status(200).json({
                success: true,
                message: 'Successfully enrolled in course',
                data: enrollment
            });
        } catch (error) {
            // Handle specific error types according to specifications
            if (error.message.includes('Already enrolled')) {
                return res.status(409).json({
                    success: false,
                    message: 'Already enrolled in this course',
                    error: 'User is already enrolled'
                });
            }
            
            if (error.message.includes('Course not found') || error.message.includes('not available')) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                    error: 'Course with specified ID does not exist'
                });
            }
            
            // Generic server error
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: 'Database connection failed'
            });
        }
    }

    /**
     * Unenroll user from a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async unenrollFromCourse(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user?.id || req.body.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            await this.enrollmentService.unenrollFromCourse(userId, courseId);
            
            res.status(200).json({
                success: true,
                message: 'Successfully unenrolled from course'
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 400;
            
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Check enrollment status for a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async checkEnrollmentStatus(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user?.id || req.query.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const enrollment = await this.enrollmentService.checkEnrollmentStatus(userId, courseId);
            
            res.status(200).json({
                success: true,
                message: 'Enrollment status retrieved',
                data: {
                    isEnrolled: !!enrollment,
                    enrollment: enrollment
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get user's enrolled courses
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUserEnrollments(req, res) {
        try {
            const userId = req.user?.id || req.params.userId;
            const { status } = req.query;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const enrollments = await this.enrollmentService.getUserEnrollments(userId, status);
            
            res.status(200).json({
                success: true,
                message: 'User enrollments retrieved successfully',
                data: enrollments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get course enrollments (admin only)
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCourseEnrollments(req, res) {
        try {
            const { courseId } = req.params;
            const { status } = req.query;

            const enrollments = await this.enrollmentService.getCourseEnrollments(courseId, status);
            
            res.status(200).json({
                success: true,
                message: 'Course enrollments retrieved successfully',
                data: enrollments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update enrollment progress
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateProgress(req, res) {
        try {
            const { courseId } = req.params;
            const { progressPercentage } = req.body;
            const userId = req.user?.id || req.body.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            if (typeof progressPercentage !== 'number' || progressPercentage < 0 || progressPercentage > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Progress percentage must be a number between 0 and 100'
                });
            }

            const enrollment = await this.enrollmentService.updateProgress(userId, courseId, progressPercentage);
            
            res.status(200).json({
                success: true,
                message: 'Progress updated successfully',
                data: enrollment
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 400;
            
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get course enrollment statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCourseStats(req, res) {
        try {
            const { courseId } = req.params;

            const stats = await this.enrollmentService.getCourseStats(courseId);
            
            res.status(200).json({
                success: true,
                message: 'Course statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get specific user enrollment for a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUserCourseEnrollment(req, res) {
        try {
            const { userId, courseId } = req.params;

            const enrollment = await this.enrollmentService.checkEnrollmentStatus(userId, courseId);
            
            if (!enrollment) {
                return res.status(200).json({
                    success: true,
                    data: {
                        isEnrolled: false,
                        enrollmentDate: null,
                        progress: 0
                    }
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    isEnrolled: true,
                    enrollmentDate: enrollment.enrollmentDate,
                    progress: enrollment.progressPercentage || 0
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = EnrollmentController;