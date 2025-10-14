# YouthGuard Platform

A comprehensive backend solution designed to reduce youth involvement in fraud and cybercrime in Nigeria by providing education, job opportunities, and positive engagement.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Overview

YouthGuard is a platform that addresses the growing concern of youth involvement in cybercrime and fraud in Nigeria. The platform provides:

- **Educational Resources**: Comprehensive courses on cybersecurity, ethical hacking, and legitimate career paths
- **Job Opportunities**: Verified job listings from legitimate employers
- **Skill Development**: Tools to track and develop marketable skills
- **Community Support**: Safe spaces for youth to engage positively
- **Career Guidance**: Personalized career recommendations based on skills and interests

## Architecture

The backend follows a layered, service-oriented architecture:

```
CLIENT <-> API GATEWAY <-> CONTROLLERS <-> SERVICES <-> REPOSITORIES <-> DATABASE
```

### Layers

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Implement business logic and coordinate operations
3. **Repositories**: Abstract database operations
4. **Models**: Define data structures and relationships
5. **Middleware**: Handle cross-cutting concerns (auth, validation, etc.)
6. **Utilities**: Helper functions and shared components

## Core Features

### User Management
- User registration and authentication
- Profile management
- Role-based access control
- Account verification and security

### Youth Development
- Comprehensive youth profiles
- Education and employment tracking
- Skills and interests management
- Portfolio and achievements
- Career development tools

### Learning Platform
- Course creation and management
- Multi-format content delivery (video, text, interactive)
- Progress tracking and analytics
- Quiz and assessment system
- Certification management

### Job Marketplace
- Job posting and management
- Application tracking system
- Interview scheduling
- Employer verification
- Location-based job search

### Communication System
- Real-time messaging
- Direct and group conversations
- File sharing
- Message reactions and threading
- Privacy controls

### Analytics and Reporting
- User engagement analytics
- Learning progress tracking
- Job market insights
- Platform performance metrics

## Technology Stack

### Runtime Environment
- **Node.js** (LTS version)
- **Express.js** - Web framework

### Database
- **MongoDB** - NoSQL document database
- **Mongoose** - Object Document Mapper

### Authentication
- **JWT** - JSON Web Tokens
- **bcrypt.js** - Password hashing

### Utilities
- **Winston** - Logging
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security headers
- **compression** - Response compression

### Development Tools
- **Nodemon** - Development server reloading
- **ESLint** - Code quality
- **Jest** - Testing framework

## Project Structure

```
src/
├── controllers/          # HTTP request handlers
├── services/             # Business logic layer
├── repositories/         # Data access layer
├── models/              # Database models
├── middleware/          # Cross-cutting concerns
├── routes/              # API route definitions
├── utils/               # Helper functions
├── config/              # Configuration files
└── server.js            # Application entry point

tests/
├── unit/                # Unit tests
├── integration/         # Integration tests
└── e2e/                 # End-to-end tests
```

### Key Files

- `server.js` - Main application entry point
- `src/config/app.js` - Express application configuration
- `src/config/database.js` - Database connection management
- `src/routes/api.js` - Main API router
- `src/middleware/auth.js` - Authentication middleware
- `src/middleware/errorHandler.js` - Global error handling

## Installation

### Prerequisites

- Node.js (LTS version)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd youthguard-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables (see Configuration section)

5. Start the development server:
```bash
npm run dev
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/youthguard
MONGODB_TEST_URI=mongodb://localhost:27017/youthguard_test

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# Security
BCRYPT_SALT_ROUNDS=10

# Logging
LOG_LEVEL=info

# Services
CLOUD_STORAGE_PROVIDER=local
EMAIL_SERVICE_PROVIDER=smtp
```

### Database Configuration

The application uses MongoDB with Mongoose. Configure the connection in `src/config/database.js`.

## API Documentation

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "role": "youth"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john.doe@example.com",
  "password": "securepassword123"
}
```

### User Management

#### Get User Profile
```
GET /api/users/profile
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```
PUT /api/users/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+2341234567890"
}
```

### Youth Development

#### Create Youth Profile
```
POST /api/youth
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "dateOfBirth": "1995-05-15",
  "gender": "male",
  "location": {
    "state": "lagos",
    "country": "nigeria"
  },
  "education": {
    "level": "bachelor",
    "field": "Computer Science",
    "institution": "University of Lagos"
  }
}
```

### Course Management

#### Create Course
```
POST /api/courses
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Introduction to Cybersecurity",
  "description": "Learn the fundamentals of cybersecurity",
  "shortDescription": "Cybersecurity basics course",
  "category": {
    "primary": "cybersecurity"
  },
  "level": "beginner"
}
```

### Job Marketplace

#### Create Job
```
POST /api/jobs
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Junior Developer",
  "description": "Entry-level software development position",
  "summary": "Great opportunity for beginners",
  "category": {
    "primary": "technology"
  },
  "type": {
    "employment": "full_time"
  },
  "location": {
    "type": "onsite",
    "address": {
      "city": "Lagos",
      "state": "lagos"
    }
  },
  "compensation": {
    "salary": {
      "min": 150000,
      "max": 250000,
      "currency": "NGN",
      "period": "monthly"
    }
  }
}
```

## Development

### Code Structure

The application follows a modular structure with clear separation of concerns:

1. **Models** - Define data structures and validation rules
2. **Repositories** - Handle database operations
3. **Services** - Implement business logic
4. **Controllers** - Handle HTTP requests
5. **Middleware** - Handle cross-cutting concerns

### Best Practices

1. **Error Handling** - Use centralized error handling middleware
2. **Validation** - Validate all input data at the controller level
3. **Security** - Implement proper authentication and authorization
4. **Logging** - Use structured logging for debugging and monitoring
5. **Testing** - Write comprehensive unit and integration tests

### Development Workflow

1. Create feature branch
2. Implement functionality following the layered architecture
3. Write unit tests
4. Write integration tests
5. Update documentation
6. Submit pull request

## Testing

### Unit Tests

Unit tests are located in the `tests/unit` directory and test individual components in isolation.

```bash
npm run test:unit
```

### Integration Tests

Integration tests are located in the `tests/integration` directory and test the interaction between components.

```bash
npm run test:integration
```

### End-to-End Tests

End-to-end tests are located in the `tests/e2e` directory and test complete user flows.

```bash
npm run test:e2e
```

### Test Coverage

Run tests with coverage reporting:

```bash
npm run test:coverage
```

## Deployment

### Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js
```

3. Configure reverse proxy (Nginx/Apache)
4. Set up SSL certificates
5. Configure monitoring and logging

### Docker Deployment

Build and run with Docker:

```bash
docker build -t youthguard-backend .
docker run -p 3000:3000 youthguard-backend
```

### Cloud Deployment

The application can be deployed to various cloud platforms:

- **Heroku**: Using Heroku CLI and buildpacks
- **AWS**: Using Elastic Beanstalk or ECS
- **Google Cloud**: Using App Engine or GKE
- **Azure**: Using App Service or AKS

## Security

### Authentication Security

- JWT tokens with secure signing
- Password hashing with bcrypt
- Session management
- Token expiration and refresh

### Data Security

- Input validation and sanitization
- Output encoding to prevent XSS
- Database injection protection
- Sensitive data encryption

### Network Security

- HTTPS enforcement
- CORS configuration
- Rate limiting
- Security headers (helmet.js)
- Content Security Policy

### Compliance

- Data protection regulations
- Privacy policy compliance
- Security standards adherence
- Audit trail maintenance

## Contributing

### Code of Conduct

Please read our Code of Conduct before contributing.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Update documentation
6. Submit a pull request

### Pull Request Guidelines

- Follow the existing code style
- Include tests for new functionality
- Update documentation as needed
- Keep pull requests focused on a single feature
- Write clear commit messages

### Reporting Issues

Please use the GitHub issue tracker to report bugs or request features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or open an issue on GitHub.

---

*YouthGuard - Empowering Nigerian Youth for a Better Future*