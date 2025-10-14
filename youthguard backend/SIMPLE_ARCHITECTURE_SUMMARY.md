# YouthGuard Simple Backend Architecture

This document summarizes the simplified backend architecture for the YouthGuard platform, following Clean Code principles by Robert C. Martin and focusing on a clean layered architecture.

## Architecture Overview

The simplified backend follows a clean layered architecture with four main layers:

1. **Controllers** - Handle HTTP requests and responses
2. **Services** - Contain business logic
3. **Repositories** - Handle data access (simplified in this version)
4. **Models** - Define data structures and validation

## File Structure

```
src/
├── simple-server.js          # Main server entry point
├── routes/
│   └── simple-api.js         # API routes
├── controllers/
│   └── SimpleUserController.js # User controller
├── services/
│   └── SimpleUserService.js    # User service
├── models/
│   └── SimpleUser.js           # Simplified user model
└── config/
    └── database.js             # Database configuration
```

## Key Components

### 1. Controllers Layer
- **SimpleUserController.js**: Handles all HTTP requests related to user management
- Methods: register, login, getProfile, updateProfile
- Follows Clean Code principles with clear method names and single responsibility

### 2. Services Layer
- **SimpleUserService.js**: Contains all business logic for user operations
- Handles user registration, authentication, profile management
- Implements password hashing and JWT token generation
- Follows SOLID principles with single responsibility

### 3. Models Layer
- **SimpleUser.js**: Simplified user data model
- Defines user schema with essential fields
- Implements password hashing middleware
- Provides methods for password comparison and token generation

### 4. Routes Layer
- **simple-api.js**: Defines all API endpoints
- Maps HTTP requests to controller methods
- Uses proper HTTP methods and status codes

## Core Features Implemented

1. **User Registration**
   - Email validation and uniqueness check
   - Password hashing for security
   - Account status management

2. **User Authentication**
   - Secure login with password verification
   - JWT token generation for session management
   - Last login tracking

3. **Profile Management**
   - Retrieve user profile
   - Update user profile information

## Clean Code Principles Applied

1. **Meaningful Names**: All classes, methods, and variables have clear, descriptive names
2. **Single Responsibility**: Each class and method has one clear purpose
3. **Small Functions**: Methods are kept small and focused
4. **DRY (Don't Repeat Yourself)**: Common functionality is extracted into reusable methods
5. **Error Handling**: Proper error handling with meaningful messages
6. **Comments**: Clear documentation explaining complex logic

## SOLID Principles Applied

1. **Single Responsibility Principle**: Each class has one reason to change
2. **Open/Closed Principle**: Classes are open for extension but closed for modification
3. **Dependency Inversion**: High-level modules don't depend on low-level modules

## Testing

The backend has been tested and verified to work correctly with:
- Health check endpoint
- User registration
- User authentication
- JWT token generation

## How to Run

1. Ensure MongoDB is running
2. Run `node src/simple-server.js`
3. Server will start on port 5000
4. API endpoints are available at `/api/*`

## API Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

This simplified architecture provides a clean, maintainable foundation for the YouthGuard platform while following Clean Code principles and best practices.