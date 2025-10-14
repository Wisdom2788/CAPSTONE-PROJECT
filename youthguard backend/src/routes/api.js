/**
 * Main Router - YouthGuard Platform
 * 
 * This is the main router file that coordinates all API endpoints
 * for the YouthGuard platform. It imports and mounts all controller-specific
 * routers to create a complete API routing system.
 * 
 * Key Features:
 * - Centralized API routing
 * - Controller coordination
 * - Route organization by resource
 * - Middleware integration
 */

const express = require('express');
const router = express.Router();

// Import controllers (they will be initialized with DI)
const UserController = require('../controllers/UserController');
const YouthController = require('../controllers/YouthController');
const CourseController = require('../controllers/CourseController');
const JobController = require('../controllers/JobController');
const ApplicationController = require('../controllers/ApplicationController');
const ProgressController = require('../controllers/ProgressController');
const MessageController = require('../controllers/MessageController');
const ConversationController = require('../controllers/ConversationController');

// Import middleware
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const validateMiddleware = require('../middleware/validate');

// Controllers will be initialized with dependency injection in the app configuration

/**
 * Authentication Routes
 */
router.post('/auth/register', (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.register(req, res, next);
});

router.post('/auth/login', (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.login(req, res, next);
});

/**
 * User Routes
 */
router.get('/users/profile', authMiddleware, (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.getProfile(req, res, next);
});

router.put('/users/profile', authMiddleware, (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.updateProfile(req, res, next);
});

router.put('/users/password', authMiddleware, (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.changePassword(req, res, next);
});

router.post('/users/verify-email', authMiddleware, (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.verifyEmail(req, res, next);
});

router.get('/users/search', authMiddleware, (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.searchUsers(req, res, next);
});

router.get('/users/statistics', authMiddleware, (req, res, next) => {
    const userController = req.app.get('container').resolve('UserController');
    userController.getStatistics(req, res, next);
});

/**
 * Youth Routes
 */
router.post('/youth', authMiddleware, youthController.createYouthProfile.bind(youthController));
router.get('/youth/:id', authMiddleware, youthController.getYouthProfile.bind(youthController));
router.put('/youth/:id', authMiddleware, youthController.updateYouthProfile.bind(youthController));
router.put('/youth/:id/education', authMiddleware, youthController.updateEducation.bind(youthController));
router.put('/youth/:id/employment', authMiddleware, youthController.updateEmployment.bind(youthController));
router.post('/youth/:id/skills', authMiddleware, youthController.addSkill.bind(youthController));
router.delete('/youth/:id/skills/:skillName', authMiddleware, youthController.removeSkill.bind(youthController));
router.put('/youth/:id/skills/:skillName', authMiddleware, youthController.updateSkillLevel.bind(youthController));
router.post('/youth/:id/interests', authMiddleware, youthController.addInterest.bind(youthController));
router.delete('/youth/:id/interests/:interest', authMiddleware, youthController.removeInterest.bind(youthController));
router.get('/youth/search', authMiddleware, youthController.searchYouth.bind(youthController));
router.get('/youth/statistics', authMiddleware, youthController.getStatistics.bind(youthController));

/**
 * Course Routes
 */
router.post('/courses', authMiddleware, courseController.createCourse.bind(courseController));
router.get('/courses/:id', authMiddleware, courseController.getCourse.bind(courseController));
router.put('/courses/:id', authMiddleware, courseController.updateCourse.bind(courseController));
router.post('/courses/:id/publish', authMiddleware, courseController.publishCourse.bind(courseController));
router.post('/courses/:id/lessons', authMiddleware, courseController.addLesson.bind(courseController));
router.delete('/courses/:id/lessons/:lessonId', authMiddleware, courseController.removeLesson.bind(courseController));
router.post('/courses/:id/enroll', authMiddleware, courseController.enrollUser.bind(courseController));
router.post('/courses/:id/unenroll', authMiddleware, courseController.unenrollUser.bind(courseController));
router.post('/courses/:id/rating', authMiddleware, courseController.addRating.bind(courseController));
router.get('/courses/search', authMiddleware, courseController.searchCourses.bind(courseController));
router.get('/courses/statistics', authMiddleware, courseController.getStatistics.bind(courseController));

/**
 * Job Routes
 */
router.post('/jobs', authMiddleware, jobController.createJob.bind(jobController));
router.get('/jobs/:id', authMiddleware, jobController.getJob.bind(jobController));
router.put('/jobs/:id', authMiddleware, jobController.updateJob.bind(jobController));
router.post('/jobs/:id/activate', authMiddleware, jobController.activateJob.bind(jobController));
router.post('/jobs/:id/deactivate', authMiddleware, jobController.deactivateJob.bind(jobController));
router.post('/jobs/:id/fill', authMiddleware, jobController.fillJob.bind(jobController));
router.get('/jobs/search', authMiddleware, jobController.searchJobs.bind(jobController));
router.get('/jobs', authMiddleware, jobController.getJobsByCriteria.bind(jobController));
router.get('/jobs/statistics', authMiddleware, jobController.getStatistics.bind(jobController));

/**
 * Application Routes
 */
router.post('/applications', authMiddleware, applicationController.submitApplication.bind(applicationController));
router.get('/applications/:id', authMiddleware, applicationController.getApplication.bind(applicationController));
router.put('/applications/:id/status', authMiddleware, applicationController.updateStatus.bind(applicationController));
router.post('/applications/:id/interview', authMiddleware, applicationController.scheduleInterview.bind(applicationController));
router.post('/applications/:id/communication', authMiddleware, applicationController.addCommunication.bind(applicationController));
router.post('/applications/:id/read', authMiddleware, applicationController.markCommunicationsAsRead.bind(applicationController));
router.get('/applications/search', authMiddleware, applicationController.searchApplications.bind(applicationController));
router.get('/applications', authMiddleware, applicationController.getApplicationsByCriteria.bind(applicationController));
router.get('/applications/statistics', authMiddleware, applicationController.getStatistics.bind(applicationController));

/**
 * Progress Routes
 */
router.get('/progress/:courseId', authMiddleware, progressController.getOrCreateProgress.bind(progressController));
router.post('/progress/:progressId/lessons/:lessonId/start', authMiddleware, progressController.startLesson.bind(progressController));
router.post('/progress/:progressId/lessons/:lessonId/complete', authMiddleware, progressController.completeLesson.bind(progressController));
router.post('/progress/:progressId/lessons/:lessonId/time', authMiddleware, progressController.recordTimeSpent.bind(progressController));
router.post('/progress/:progressId/lessons/:lessonId/quiz', authMiddleware, progressController.submitQuizAttempt.bind(progressController));
router.post('/progress/:progressId/lessons/:lessonId/note', authMiddleware, progressController.addNote.bind(progressController));
router.get('/progress/statistics/user', authMiddleware, progressController.getUserStatistics.bind(progressController));
router.get('/progress/statistics/course/:courseId', authMiddleware, progressController.getCourseStatistics.bind(progressController));

/**
 * Message Routes
 */
router.post('/messages', authMiddleware, messageController.sendMessage.bind(messageController));
router.get('/messages/conversation/:conversationId', authMiddleware, messageController.getMessagesForConversation.bind(messageController));
router.post('/messages/:id/read', authMiddleware, messageController.markAsRead.bind(messageController));
router.post('/messages/read', authMiddleware, messageController.markMultipleAsRead.bind(messageController));
router.post('/messages/:id/reactions', authMiddleware, messageController.addReaction.bind(messageController));
router.delete('/messages/:id/reactions', authMiddleware, messageController.removeReaction.bind(messageController));
router.get('/messages/search', authMiddleware, messageController.searchMessages.bind(messageController));
router.get('/messages/unread', authMiddleware, messageController.getUnreadMessages.bind(messageController));
router.get('/messages/statistics', authMiddleware, messageController.getStatistics.bind(messageController));

/**
 * Conversation Routes
 */
router.post('/conversations', authMiddleware, conversationController.createConversation.bind(conversationController));
router.post('/conversations/direct', authMiddleware, conversationController.createDirectConversation.bind(conversationController));
router.get('/conversations', authMiddleware, conversationController.getConversationsForUser.bind(conversationController));
router.get('/conversations/:id', authMiddleware, conversationController.getConversation.bind(conversationController));
router.post('/conversations/:id/participants', authMiddleware, conversationController.addParticipant.bind(conversationController));
router.delete('/conversations/:id/participants/:userId', authMiddleware, conversationController.removeParticipant.bind(conversationController));
router.put('/conversations/:id/participants/:userId/role', authMiddleware, conversationController.updateParticipantRole.bind(conversationController));
router.post('/conversations/:id/join-link', authMiddleware, conversationController.generateJoinLink.bind(conversationController));
router.get('/conversations/join/:token', authMiddleware, conversationController.joinConversationByToken.bind(conversationController));
router.get('/conversations/search', authMiddleware, conversationController.searchConversations.bind(conversationController));
router.get('/conversations/statistics', authMiddleware, conversationController.getStatistics.bind(conversationController));

/**
 * Admin Routes
 */
router.get('/admin/users/statistics', authMiddleware, adminMiddleware, userController.getStatistics.bind(userController));
router.get('/admin/youth/statistics', authMiddleware, adminMiddleware, youthController.getStatistics.bind(youthController));
router.get('/admin/courses/statistics', authMiddleware, adminMiddleware, courseController.getStatistics.bind(courseController));
router.get('/admin/jobs/statistics', authMiddleware, adminMiddleware, jobController.getStatistics.bind(jobController));
router.get('/admin/applications/statistics', authMiddleware, adminMiddleware, applicationController.getStatistics.bind(applicationController));

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

/**
 * 404 Handler
 */
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = router;