/**
 * Health Check Integration Tests - YouthGuard Platform
 * 
 * These tests verify the basic functionality of the API.
 */

const request = require('supertest');
const createApp = require('../../src/config/app');

describe('Health Check API', () => {
    let app;
    
    beforeAll(() => {
        app = createApp();
    });
    
    describe('GET /health', () => {
        it('should return health check information', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);
            
            expect(response.body).toEqual({
                status: 'OK',
                timestamp: expect.any(String),
                uptime: expect.any(Number),
                environment: 'test',
                version: '1.0.0'
            });
        });
    });
    
    describe('GET /', () => {
        it('should return welcome message', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);
            
            expect(response.body).toEqual({
                message: 'Welcome to YouthGuard MVP API',
                description: 'Reducing youth involvement in fraud and cybercrime in Nigeria',
                version: '1.0.0',
                documentation: '/api/docs',
                health: '/health'
            });
        });
    });
    
    describe('GET /non-existent-route', () => {
        it('should return 404 for non-existent routes', async () => {
            const response = await request(app)
                .get('/non-existent-route')
                .expect(404);
            
            expect(response.body).toEqual({
                success: false,
                message: 'Route not found'
            });
        });
    });
});