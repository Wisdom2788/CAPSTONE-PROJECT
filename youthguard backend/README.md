# YouthGuard Platform - Backend API

A comprehensive backend solution designed to reduce youth involvement in fraud and cybercrime in Nigeria by providing education, job opportunities, and positive engagement through a clean, scalable architecture.

## 🎯 Overview

YouthGuard is a platform that redirects at-risk youth away from cybercrime through three integrated pillars:

- **🎓 Education & Skills Development**: Industry-relevant digital skills training and cybersecurity awareness
- **💼 Employment Marketplace**: Legitimate job opportunities with verified employers
- **🤝 Mentorship & Community**: One-on-one mentoring and peer support networks

## 🏗️ Architecture

The backend follows a **Clean Layered Architecture** with clear separation of concerns:

```
┌─────────────────┐
│   Controllers   │ ← HTTP Request/Response handling
├─────────────────┤
│    Services     │ ← Business Logic Layer
├─────────────────┤
│  Repositories   │ ← Data Access Layer
├─────────────────┤
│     Models      │ ← Data Structure & Validation
└─────────────────┘
```

### Key Architectural Principles

1. **Single Responsibility**: Each layer has one clear purpose
2. **Dependency Inversion**: Higher layers depend on abstractions, not implementations
3. **Separation of Concerns**: Business logic separated from data access and presentation
4. **Scalability**: Modular design allows easy feature additions and modifications

## 📁 Project Structure

```
youthguard backend/
├── src/
│   ├── controllers/          # HTTP request handlers
│   │   ├── SimpleUserController.js
│   │   ├── CourseController.js
│   │   ├── JobController.js
│   │   ├── MessageController.js
│   │   └── ProgressController.js
│   ├── services/            # Business logic layer
│   │   ├── SimpleUserService.js
│   │   ├── CourseService.js
│   │   ├── JobService.js
│   │   ├── MessageService.js
│   │   └── ProgressService.js
│   ├── repositories/        # Data access layer
│   │   ├── CourseRepository.js
│   │   ├── JobRepository.js
│   │   ├── MessageRepository.js
│   │   └── ProgressRepository.js
│   ├── models/             # Database schemas
│   │   ├── SimpleUser.js
│   │   ├── Course.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Message.js
│   │   └── Progress.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── validate.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── routes/            # API route definitions
│   │   └── simple-api.js
│   ├── dto/              # Data Transfer Objects
│   │   ├── CourseDTO.js
│   │   └── UserDTO.js
│   ├── utils/            # Utility functions
│   │   └── logger.js
│   └── simple-server.js  # Application entry point
├── tests/                # Test files
│   ├── integration/
│   │   ├── health.test.js
│   │   └── user.test.js
│   ├── unit/
│   ├── setup.js
│   └── setupAfterEnv.js
├── logs/                 # Application logs
├── uploads/              # File uploads storage
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

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
## 🚀
 Core Features

### Authentication & User Management
- **User Registration**: Secure user registration with validation
- **Authentication**: JWT-based authentication system
- **Profile Management**: User profile creation and updates
- **Role-based Access**: Different access levels for users and admins

### Education System
- **Course Management**: Create, read, update, and delete courses
- **Progress Tracking**: Monitor user learning progress
- **Skill Development**: Track skill acquisition and certification

### Job Marketplace
- **Job Listings**: Post and manage job opportunities
- **Application System**: Apply for jobs and track applications
- **Employer Verification**: Verified employer system for legitimate opportunities

### Communication
- **Messaging System**: Direct messaging between users
- **Mentorship Matching**: Connect youth with mentors
- **Community Features**: Group discussions and peer support

## 🛠️ Technology Stack

### Backend Framework
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js

### Security & Authentication
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and encryption
- **Helmet**: Security middleware for Express
- **CORS**: Cross-Origin Resource Sharing configuration

### Development & Testing
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing
- **Nodemon**: Development server with auto-restart
- **Winston**: Logging library

### Additional Tools
- **Multer**: File upload handling
- **Express Validator**: Input validation middleware
- **Socket.io**: Real-time communication
- **Nodemailer**: Email sending capabilities

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youthguard-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/youthguard_dev
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:5000/health
   ```
   
   Expected response:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "uptime": 1.234
   }
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "phoneNumber": "+2348123456789",
  "dateOfBirth": "2000-01-01",
  "gender": "male",
  "location": {
    "state": "Lagos",
    "city": "Ikeja"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

### User Management Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "location": {
    "state": "Abuja",
    "city": "Garki"
  }
}
```

### Course Management Endpoints

#### Get All Courses
```http
GET /api/courses
```

#### Get Course by ID
```http
GET /api/courses/:id
```

#### Create Course (Admin only)
```http
POST /api/courses
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "title": "Introduction to Cybersecurity",
  "description": "Learn the basics of cybersecurity",
  "category": "Security",
  "difficulty": "Beginner",
  "duration": 120,
  "modules": [
    {
      "title": "Module 1: Basics",
      "content": "Introduction to cybersecurity concepts"
    }
  ]
}
```

### Job Management Endpoints

#### Get All Jobs
```http
GET /api/jobs
```

#### Apply for Job
```http
POST /api/jobs/:id/apply
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "coverLetter": "I am interested in this position..."
}
```

### Progress Tracking Endpoints

#### Get User Progress
```http
GET /api/progress
Authorization: Bearer <jwt-token>
```

#### Update Course Progress
```http
POST /api/progress/course/:courseId
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "moduleId": "module-1",
  "completed": true,
  "timeSpent": 45
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests only
npm run test:integration
```

### Test Structure

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints and database interactions
- **Test Coverage**: Aim for >80% code coverage

### Example Test
```javascript
describe('User Registration', () => {
  test('should register a new user successfully', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'TestPass123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.token).toBeDefined();
  });
});
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Different permissions for users and admins

### Data Protection
- **Input Validation**: Comprehensive input validation using express-validator
- **SQL Injection Prevention**: MongoDB's built-in protection
- **XSS Protection**: Helmet.js security headers
- **CORS Configuration**: Controlled cross-origin requests

### Security Headers
```javascript
// Automatically applied security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb://your-production-db-url
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Database Setup**
   - Set up MongoDB Atlas or self-hosted MongoDB
   - Configure database indexes for performance
   - Set up database backups

3. **Server Configuration**
   ```bash
   # Install PM2 for process management
   npm install -g pm2
   
   # Start application with PM2
   pm2 start src/simple-server.js --name "youthguard-api"
   
   # Set up PM2 to start on boot
   pm2 startup
   pm2 save
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY .env ./

EXPOSE 5000

CMD ["npm", "start"]
```

### Health Monitoring

The application includes a health check endpoint:
```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.567,
  "database": "connected",
  "memory": {
    "used": "45.2 MB",
    "total": "128 MB"
  }
}
```

## 📊 Performance & Monitoring

### Logging
- **Winston Logger**: Structured logging with different levels
- **Request Logging**: Morgan middleware for HTTP request logging
- **Error Tracking**: Comprehensive error logging and tracking

### Performance Optimization
- **Database Indexing**: Optimized MongoDB indexes
- **Caching**: In-memory caching for frequently accessed data
- **Compression**: Gzip compression for API responses
- **Rate Limiting**: API rate limiting to prevent abuse

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write tests** for new functionality
5. **Run tests** to ensure everything works
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request**

### Code Standards

- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Comments**: Document complex logic and business rules
- **Testing**: Write tests for all new features

### Commit Message Format
```
Type: Brief description

Detailed explanation if needed

Types: Add, Update, Fix, Remove, Refactor, Test, Docs
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **JWT Token Issues**
   - Check JWT_SECRET in environment variables
   - Verify token expiration settings
   - Ensure proper token format in requests

3. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

## 🎯 Roadmap

### Phase 1: Core Platform (Current)
- ✅ User authentication and management
- ✅ Basic course system
- ✅ Job marketplace foundation
- ✅ Messaging system

### Phase 2: Enhanced Features
- 🔄 Advanced course content management
- 🔄 Mentorship matching algorithm
- 🔄 Real-time notifications
- 🔄 Mobile app API support

### Phase 3: Scale & Analytics
- 📋 Advanced analytics dashboard
- 📋 AI-powered recommendations
- 📋 Multi-language support
- 📋 Advanced reporting system

---

**YouthGuard Platform** - Transforming Nigeria's Youth Through Technology and Opportunity

*Built with ❤️ for a better future*