/**
 * Simple API Routes - YouthGuard Platform
 * 
 * Simplified routes for the core functionality
 */

const express = require('express');
const router = express.Router();

// Import simplified controllers (already instantiated)
const userController = require('../controllers/SimpleUserController');
const courseController = require('../controllers/CourseController');
const jobController = require('../controllers/JobController');
const messageController = require('../controllers/MessageController');
const progressController = require('../controllers/ProgressController');

/**
 * Authentication Routes
 */
router.post('/auth/register', userController.register.bind(userController));
router.post('/auth/login', userController.login.bind(userController));

/**
 * User Routes
 */
router.get('/users/profile', userController.getProfile.bind(userController));
router.put('/users/profile', userController.updateProfile.bind(userController));

/**
 * Course Routes
 */
router.post('/courses', courseController.createCourse.bind(courseController));
router.get('/courses', courseController.getAllCourses.bind(courseController));
router.get('/courses/:id', courseController.getCourseById.bind(courseController));
router.put('/courses/:id', courseController.updateCourse.bind(courseController));
router.delete('/courses/:id', courseController.deleteCourse.bind(courseController));
router.post('/courses/:courseId/lessons', courseController.addLesson.bind(courseController));
router.get('/courses/:courseId/lessons', courseController.getLessonsForCourse.bind(courseController));

/**
 * Job Routes
 */
router.post('/jobs', jobController.createJob.bind(jobController));
router.get('/jobs', jobController.getAllJobs.bind(jobController));
router.get('/jobs/:id', jobController.getJobById.bind(jobController));
router.put('/jobs/:id', jobController.updateJob.bind(jobController));
router.delete('/jobs/:id', jobController.deleteJob.bind(jobController));
router.post('/jobs/apply', jobController.applyForJob.bind(jobController));
router.get('/jobs/:jobId/applications', jobController.getApplicationsForJob.bind(jobController));
router.get('/users/:userId/applications', jobController.getApplicationsForUser.bind(jobController));

/**
 * Message Routes
 */
router.post('/messages', messageController.sendMessage.bind(messageController));
router.get('/messages/:userId1/:userId2', messageController.getMessagesBetweenUsers.bind(messageController));
router.put('/messages/:id/read', messageController.markAsRead.bind(messageController));
router.get('/users/:userId/messages/unread', messageController.getUnreadMessages.bind(messageController));

/**
 * Progress Routes
 */
router.post('/progress', progressController.updateProgress.bind(progressController));
router.get('/progress/:userId/:courseId', progressController.getProgressForCourse.bind(progressController));
router.get('/progress/:userId', progressController.getProgressForUser.bind(progressController));
router.get('/progress/:userId/:courseId/completion', progressController.getCourseCompletion.bind(progressController));

/**
 * Health Check Route
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'YouthGuard API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;