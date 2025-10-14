/**
 * UserDTO Unit Tests - YouthGuard Platform
 * 
 * These tests verify the functionality of the UserDTO class.
 */

const UserDTO = require('../../src/dto/UserDTO');

describe('UserDTO', () => {
    describe('constructor', () => {
        it('should create a UserDTO instance with valid data', () => {
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
                }
            };
            
            const userDTO = new UserDTO(userData);
            expect(userDTO).toBeInstanceOf(UserDTO);
        });
        
        it('should throw validation error for invalid email', () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email',
                phoneNumber: '+2348012345678',
                dateOfBirth: '2000-01-01',
                gender: 'male'
            };
            
            expect(() => new UserDTO(userData)).toThrow('Validation errors: Invalid email format');
        });
        
        it('should throw validation error for missing required fields', () => {
            const userData = {
                email: 'john.doe@example.com'
            };
            
            expect(() => new UserDTO(userData)).toThrow('Validation errors: First name is required, Last name is required');
        });
    });
    
    describe('toPublicResponse', () => {
        it('should transform DTO to public response format', () => {
            const userData = {
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
                userType: 'Youth',
                isActive: true,
                isEmailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const userDTO = new UserDTO(userData);
            const publicResponse = userDTO.toPublicResponse();
            
            expect(publicResponse).toEqual({
                id: '12345',
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
                profilePicture: undefined,
                bio: undefined,
                userType: 'Youth',
                isActive: true,
                isEmailVerified: false,
                isPhoneVerified: undefined,
                accountStatus: undefined,
                lastLogin: undefined,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                fullName: 'John Doe',
                age: expect.any(Number)
            });
        });
    });
    
    describe('toProfileUpdate', () => {
        it('should transform DTO to profile update format', () => {
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
                bio: 'Software developer'
            };
            
            const userDTO = new UserDTO(userData);
            const profileUpdate = userDTO.toProfileUpdate();
            
            expect(profileUpdate).toEqual({
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '+2348012345678',
                dateOfBirth: '2000-01-01',
                gender: 'male',
                location: {
                    state: 'Lagos',
                    city: 'Ikeja'
                },
                profilePicture: undefined,
                bio: 'Software developer'
            });
        });
    });
    
    describe('toRegistration', () => {
        it('should transform DTO to registration format', () => {
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
                password: 'Password123!',
                userType: 'Youth'
            };
            
            const userDTO = new UserDTO(userData);
            const registrationData = userDTO.toRegistration();
            
            expect(registrationData).toEqual({
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
                password: 'Password123!',
                userType: 'Youth'
            });
        });
    });
    
    describe('fromModel', () => {
        it('should create DTO from user model', () => {
            const userModel = {
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
                userType: 'Youth',
                isActive: true,
                isEmailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const userDTO = UserDTO.fromModel(userModel);
            
            expect(userDTO).toBeInstanceOf(UserDTO);
            expect(userDTO.get('_id')).toBe('12345');
            expect(userDTO.get('firstName')).toBe('John');
            expect(userDTO.get('email')).toBe('john.doe@example.com');
        });
    });
});