# YouthGuard Backend Architecture Structure

## Project Structure Explanation

```
CAPSTONE PROJECT/
├── src/                          # Main source code directory
│   ├── controllers/              # API endpoint handlers (business logic entry points)
│   ├── models/                   # Database schemas and models (Mongoose schemas)
│   ├── services/                 # Business logic layer (core functionality)
│   ├── repositories/             # Data access layer (database operations)
│   ├── middleware/               # Custom middleware functions (auth, validation, etc.)
│   ├── routes/                   # API route definitions (URL mappings)
│   ├── dto/                      # Data Transfer Objects (request/response structures)
│   ├── utils/                    # Utility functions and helpers
│   └── config/                   # Configuration files (database, app settings)
├── tests/                        # Test files (unit tests, integration tests)
├── uploads/                      # Uploaded files storage (temporary)
├── logs/                         # Application logs
├── node_modules/                 # NPM dependencies
├── package.json                  # Project configuration and dependencies
└── .env                          # Environment variables (sensitive data)
```

## Architecture Layer Explanation

### 1. **Controllers Layer** (`src/controllers/`)
**Purpose**: Handle HTTP requests and responses
**Responsibility**: 
- Receive HTTP requests
- Validate input using DTOs
- Call appropriate services
- Return HTTP responses
- Handle errors and status codes

**Example Files**:
- `authController.js` - Handle login, registration, password reset
- `userController.js` - Handle user profile operations
- `courseController.js` - Handle course management
- `jobController.js` - Handle job postings and applications

### 2. **Models Layer** (`src/models/`)
**Purpose**: Define database schemas and data structure
**Responsibility**:
- Define Mongoose schemas
- Set validation rules
- Define relationships between collections
- Add virtual fields and methods
- Set up indexes for performance

**Example Files**:
- `User.js` - User schema with inheritance (Youth, Mentor, Employer)
- `Course.js` - Course schema with lessons
- `Job.js` - Job posting schema
- `Application.js` - Job application schema

### 3. **Services Layer** (`src/services/`)
**Purpose**: Contain business logic and orchestrate operations
**Responsibility**:
- Implement business rules
- Coordinate between repositories
- Handle complex operations
- Implement algorithms (matching, recommendations)
- Call external APIs

**Example Files**:
- `authService.js` - Authentication logic, JWT handling
- `userService.js` - User management logic
- `courseService.js` - Learning management logic
- `emailService.js` - Email sending logic

### 4. **Repositories Layer** (`src/repositories/`)
**Purpose**: Handle direct database operations
**Responsibility**:
- CRUD operations (Create, Read, Update, Delete)
- Database queries
- Data aggregation
- Transaction handling
- Database-specific optimizations

**Example Files**:
- `userRepository.js` - User database operations
- `courseRepository.js` - Course database operations
- `jobRepository.js` - Job database operations

### 5. **Middleware Layer** (`src/middleware/`)
**Purpose**: Process requests before they reach controllers
**Responsibility**:
- Authentication verification
- Input validation
- Rate limiting
- Error handling
- Logging
- File upload processing

**Example Files**:
- `auth.js` - JWT token verification
- `validation.js` - Input validation middleware
- `upload.js` - File upload handling
- `rateLimiter.js` - API rate limiting

### 6. **Routes Layer** (`src/routes/`)
**Purpose**: Define API endpoints and map them to controllers
**Responsibility**:
- URL routing
- HTTP method mapping
- Middleware application
- Route grouping
- API versioning

**Example Files**:
- `authRoutes.js` - Authentication endpoints
- `userRoutes.js` - User management endpoints
- `courseRoutes.js` - Course management endpoints
- `jobRoutes.js` - Job marketplace endpoints

### 7. **DTO Layer** (`src/dto/`)
**Purpose**: Define data transfer objects for requests and responses
**Responsibility**:
- Request validation schemas
- Response formatting
- Data transformation
- Type safety
- API documentation structure

**Example Files**:
- `authDTO.js` - Login, registration request/response formats
- `userDTO.js` - User profile request/response formats
- `courseDTO.js` - Course data transfer objects

### 8. **Utils Layer** (`src/utils/`)
**Purpose**: Reusable utility functions
**Responsibility**:
- Helper functions
- Constants
- Formatters
- Validators
- Common algorithms

**Example Files**:
- `logger.js` - Logging configuration
- `constants.js` - Application constants
- `helpers.js` - Common helper functions
- `validators.js` - Custom validation functions

### 9. **Config Layer** (`src/config/`)
**Purpose**: Application configuration
**Responsibility**:
- Database configuration
- Environment setup
- Third-party service configuration
- Application settings

**Example Files**:
- `database.js` - MongoDB connection configuration
- `app.js` - Express app configuration
- `email.js` - Email service configuration

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Each layer has a specific responsibility
- Easy to maintain and modify
- Clear dependencies between layers

### 2. **Scalability**
- Can scale individual components
- Easy to add new features
- Microservices ready

### 3. **Testability**
- Each layer can be tested independently
- Mock dependencies easily
- Unit and integration testing

### 4. **Maintainability**
- Clear code organization
- Easy to find and fix bugs
- New developers can understand quickly

### 5. **Reusability**
- Services can be reused across controllers
- Repositories can be shared
- Utilities are common across the app

## Request Flow Example

```
HTTP Request → Routes → Middleware → Controller → Service → Repository → Database
                ↓         ↓           ↓           ↓          ↓
            Validation  Auth Check  Business   Data       MongoDB
                                   Logic      Access
```

This architecture ensures our YouthGuard MVP is robust, scalable, and maintainable!