/**
 * Service Container - YouthGuard Platform
 * 
 * This module sets up the dependency injection container with all services.
 * It registers all application services and their dependencies.
 */

const DIContainer = require('./Container');

// Import all services
const UserService = require('../services/UserService');
const CourseService = require('../services/CourseService');
const JobService = require('../services/JobService');
const MentorshipService = require('../services/MentorshipService');
const MessageService = require('../services/MessageService');
const NotificationService = require('../services/NotificationService');
const ReportingService = require('../services/ReportingService');
const AnalyticsService = require('../services/AnalyticsService');

// Import all repositories
const UserRepository = require('../repositories/UserRepository');
const CourseRepository = require('../repositories/CourseRepository');
const JobRepository = require('../repositories/JobRepository');
const MentorshipRepository = require('../repositories/MentorshipRepository');
const MessageRepository = require('../repositories/MessageRepository');
const NotificationRepository = require('../repositories/NotificationRepository');
const ReportingRepository = require('../repositories/ReportingRepository');
const AnalyticsRepository = require('../repositories/AnalyticsRepository');

/**
 * Create and configure the service container
 * @returns {DIContainer} Configured DI container
 */
function createServiceContainer() {
    const container = new DIContainer();
    
    // Register repositories (singleton by default)
    container.register('UserRepository', () => new UserRepository());
    container.register('CourseRepository', () => new CourseRepository());
    container.register('JobRepository', () => new JobRepository());
    container.register('MentorshipRepository', () => new MentorshipRepository());
    container.register('MessageRepository', () => new MessageRepository());
    container.register('NotificationRepository', () => new NotificationRepository());
    container.register('ReportingRepository', () => new ReportingRepository());
    container.register('AnalyticsRepository', () => new AnalyticsRepository());
    
    // Register services (singleton by default)
    container.register('UserService', (container) => {
        const userService = new UserService();
        userService.repository = container.resolve('UserRepository');
        return userService;
    });
    
    container.register('CourseService', (container) => {
        const courseService = new CourseService();
        courseService.repository = container.resolve('CourseRepository');
        return courseService;
    });
    
    container.register('JobService', (container) => {
        const jobService = new JobService();
        jobService.repository = container.resolve('JobRepository');
        return jobService;
    });
    
    container.register('MentorshipService', (container) => {
        const mentorshipService = new MentorshipService();
        mentorshipService.repository = container.resolve('MentorshipRepository');
        return mentorshipService;
    });
    
    container.register('MessageService', (container) => {
        const messageService = new MessageService();
        messageService.repository = container.resolve('MessageRepository');
        return messageService;
    });
    
    container.register('NotificationService', (container) => {
        const notificationService = new NotificationService();
        notificationService.repository = container.resolve('NotificationRepository');
        return notificationService;
    });
    
    container.register('ReportingService', (container) => {
        const reportingService = new ReportingService();
        reportingService.repository = container.resolve('ReportingRepository');
        return reportingService;
    });
    
    container.register('AnalyticsService', (container) => {
        const analyticsService = new AnalyticsService();
        analyticsService.repository = container.resolve('AnalyticsRepository');
        return analyticsService;
    });
    
    return container;
}

module.exports = createServiceContainer;