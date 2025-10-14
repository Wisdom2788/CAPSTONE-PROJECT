/**
 * Controller Factory - YouthGuard Platform
 * 
 * This factory creates controller instances with their dependencies injected.
 * It uses the DI container to resolve service dependencies.
 */

// Import all controllers
const UserController = require('../controllers/UserController');
const YouthController = require('../controllers/YouthController');
const CourseController = require('../controllers/CourseController');
const JobController = require('../controllers/JobController');
const ApplicationController = require('../controllers/ApplicationController');
const ProgressController = require('../controllers/ProgressController');
const MessageController = require('../controllers/MessageController');
const ConversationController = require('../controllers/ConversationController');

/**
 * ControllerFactory Class
 * 
 * Factory for creating controller instances with injected dependencies.
 */
class ControllerFactory {
    /**
     * Constructor
     * @param {Object} container - DI container instance
     */
    constructor(container) {
        this.container = container;
    }
    
    /**
     * Create UserController instance
     * @returns {UserController} UserController instance
     */
    createUserController() {
        const userService = this.container.resolve('UserService');
        return new UserController(userService);
    }
    
    /**
     * Create YouthController instance
     * @returns {YouthController} YouthController instance
     */
    createYouthController() {
        const youthService = this.container.resolve('YouthService');
        return new YouthController(youthService);
    }
    
    /**
     * Create CourseController instance
     * @returns {CourseController} CourseController instance
     */
    createCourseController() {
        const courseService = this.container.resolve('CourseService');
        return new CourseController(courseService);
    }
    
    /**
     * Create JobController instance
     * @returns {JobController} JobController instance
     */
    createJobController() {
        const jobService = this.container.resolve('JobService');
        return new JobController(jobService);
    }
    
    /**
     * Create ApplicationController instance
     * @returns {ApplicationController} ApplicationController instance
     */
    createApplicationController() {
        const applicationService = this.container.resolve('ApplicationService');
        return new ApplicationController(applicationService);
    }
    
    /**
     * Create ProgressController instance
     * @returns {ProgressController} ProgressController instance
     */
    createProgressController() {
        const progressService = this.container.resolve('ProgressService');
        return new ProgressController(progressService);
    }
    
    /**
     * Create MessageController instance
     * @returns {MessageController} MessageController instance
     */
    createMessageController() {
        const messageService = this.container.resolve('MessageService');
        return new MessageController(messageService);
    }
    
    /**
     * Create ConversationController instance
     * @returns {ConversationController} ConversationController instance
     */
    createConversationController() {
        const conversationService = this.container.resolve('ConversationService');
        return new ConversationController(conversationService);
    }
    
    /**
     * Create all controllers
     * @returns {Object} Object containing all controller instances
     */
    createAllControllers() {
        return {
            userController: this.createUserController(),
            youthController: this.createYouthController(),
            courseController: this.createCourseController(),
            jobController: this.createJobController(),
            applicationController: this.createApplicationController(),
            progressController: this.createProgressController(),
            messageController: this.createMessageController(),
            conversationController: this.createConversationController()
        };
    }
}

module.exports = ControllerFactory;