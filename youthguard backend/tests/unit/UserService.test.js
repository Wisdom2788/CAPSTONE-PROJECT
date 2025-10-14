/**
 * UserService Unit Tests - YouthGuard Platform
 * 
 * These tests verify the functionality of the UserService class.
 */

const UserService = require('../../src/services/UserService');

// Mock the UserRepository
const mockUserRepository = {
    create: jest.fn(),
    findByEmailOrUsername: jest.fn(),
    updateLastLogin: jest.fn(),
    incrementLoginCount: jest.fn(),
    update: jest.fn(),
    findById: jest.fn()
};

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn()
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('jwtToken')
}));

describe('UserService', () => {
    let userService;
    
    beforeEach(() => {
        // Create a new instance of UserService with mocked repository
        userService = new UserService();
        userService.repository = mockUserRepository;
        
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+2348012345678',
                dateOfBirth: '2000-01-01',
                gender: 'male',
                location: {
                    state: 'Lagos',
                    city: 'Ikeja'
                },
                password: 'Password123!'
            };
            
            const createdUser = {
                _id: '12345',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+2348012345678',
                dateOfBirth: '2000-01-01',
                gender: 'male',
                location: {
                    state: 'Lagos',
                    city: 'Ikeja'
                },
                password: 'hashedPassword',
                account: {
                    status: 'pending_verification',
                    isEmailVerified: false,
                    createdAt: new Date()
                },
                userType: 'Youth'
            };
            
            mockUserRepository.create.mockResolvedValue(createdUser);
            
            const result = await userService.register(userData);
            
            expect(result).toEqual(createdUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+2348012345678',
                dateOfBirth: '2000-01-01',
                gender: 'male',
                location: {
                    state: 'Lagos',
                    city: 'Ikeja'
                },
                password: 'hashedPassword',
                account: {
                    status: 'pending_verification',
                    isEmailVerified: false,
                    createdAt: expect.any(Date)
                },
                userType: 'Youth'
            });
        });
        
        it('should throw error when repository fails', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+2348012345678',
                dateOfBirth: '2000-01-01',
                gender: 'male',
                location: {
                    state: 'Lagos',
                    city: 'Ikeja'
                },
                password: 'Password123!'
            };
            
            mockUserRepository.create.mockRejectedValue(new Error('Database error'));
            
            await expect(userService.register(userData)).rejects.toThrow('Database error');
        });
    });
    
    describe('authenticate', () => {
        it('should authenticate user successfully', async () => {
            const user = {
                _id: '12345',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'hashedPassword',
                role: 'youth',
                account: {
                    status: 'active'
                }
            };
            
            mockUserRepository.findByEmailOrUsername.mockResolvedValue(user);
            require('bcryptjs').compare.mockResolvedValue(true);
            mockUserRepository.updateLastLogin.mockResolvedValue();
            mockUserRepository.incrementLoginCount.mockResolvedValue();
            
            const result = await userService.authenticate('john.doe@example.com', 'Password123!');
            
            expect(result).toEqual({
                user: expect.objectContaining({
                    id: '12345',
                    email: 'john.doe@example.com'
                }),
                token: 'jwtToken'
            });
            
            expect(mockUserRepository.findByEmailOrUsername).toHaveBeenCalledWith('john.doe@example.com');
            expect(require('bcryptjs').compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
            expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith('12345');
            expect(mockUserRepository.incrementLoginCount).toHaveBeenCalledWith('12345');
        });
        
        it('should throw error for invalid credentials', async () => {
            mockUserRepository.findByEmailOrUsername.mockResolvedValue(null);
            
            await expect(userService.authenticate('john.doe@example.com', 'wrongPassword'))
                .rejects.toThrow('Invalid credentials');
        });
        
        it('should throw error for incorrect password', async () => {
            const user = {
                _id: '12345',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'hashedPassword',
                account: {
                    status: 'active'
                }
            };
            
            mockUserRepository.findByEmailOrUsername.mockResolvedValue(user);
            require('bcryptjs').compare.mockResolvedValue(false);
            
            await expect(userService.authenticate('john.doe@example.com', 'wrongPassword'))
                .rejects.toThrow('Invalid credentials');
        });
        
        it('should throw error for inactive account', async () => {
            const user = {
                _id: '12345',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'hashedPassword',
                account: {
                    status: 'suspended'
                }
            };
            
            mockUserRepository.findByEmailOrUsername.mockResolvedValue(user);
            require('bcryptjs').compare.mockResolvedValue(true);
            
            await expect(userService.authenticate('john.doe@example.com', 'Password123!'))
                .rejects.toThrow('Account is not active');
        });
    });
    
    describe('updateProfile', () => {
        it('should update user profile successfully', async () => {
            const profileData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                bio: 'Updated bio'
            };
            
            const updatedUser = {
                _id: '12345',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                bio: 'Updated bio'
            };
            
            mockUserRepository.update.mockResolvedValue(updatedUser);
            
            const result = await userService.updateProfile('12345', profileData);
            
            expect(result).toEqual(expect.objectContaining({
                id: '12345',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                bio: 'Updated bio'
            }));
            
            expect(mockUserRepository.update).toHaveBeenCalledWith('12345', {
                firstName: 'Jane',
                lastName: 'Doe',
                bio: 'Updated bio'
            });
        });
        
        it('should return null when user not found', async () => {
            const profileData = { 
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com'
            };
            mockUserRepository.update.mockResolvedValue(null);
            
            const result = await userService.updateProfile('12345', profileData);
            
            expect(result).toBeNull();
        });
    });
});