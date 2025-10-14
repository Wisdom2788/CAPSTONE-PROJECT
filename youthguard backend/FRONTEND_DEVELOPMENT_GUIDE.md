# YouthGuard Frontend Development Guide

This comprehensive guide provides all the information needed to create a beautiful, functional frontend for the YouthGuard platform that integrates seamlessly with the expanded MVP backend.

## Project Overview

YouthGuard is a platform designed to reduce youth involvement in fraud and cybercrime in Nigeria by providing:
- Educational courses on cybersecurity and digital literacy
- Job opportunities in legitimate tech sectors
- Mentorship programs
- Communication tools for networking

## Technology Stack Recommendation

### Frontend Framework
- **React.js** with **Vite** for fast development
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **Axios** for API requests

### UI Component Library
- **Headless UI** or **Radix UI** for accessible components
- **Framer Motion** for smooth animations
- **React Icons** for consistent iconography

### State Management
- **React Context API** for simple state management
- **React Query** for server state management

### Additional Tools
- **Formik** and **Yup** for form handling and validation
- **Date-fns** for date manipulation
- **React Toastify** for notifications

## API Integration Guide

### Base Configuration
```
Base URL: http://localhost:5000/api
```

### Authentication Flow

#### 1. User Registration
- **Endpoint**: `POST /auth/register`
- **Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "gender": "male|female|other",
  "location": {
    "state": "string",
    "city": "string"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "date",
    "gender": "string",
    "location": {
      "state": "string",
      "city": "string"
    },
    "userType": "Youth",
    "accountStatus": "active"
  }
}
```

#### 2. User Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "phoneNumber": "string",
      "dateOfBirth": "date",
      "gender": "string",
      "location": {
        "state": "string",
        "city": "string"
      },
      "userType": "Youth",
      "accountStatus": "active"
    },
    "token": "JWT_TOKEN"
  }
}
```

### User Profile Management

#### 1. Get User Profile
- **Endpoint**: `GET /users/profile`
- **Headers**: `user-id: USER_ID`
- **Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "date",
    "gender": "string",
    "location": {
      "state": "string",
      "city": "string"
    },
    "userType": "Youth",
    "accountStatus": "active",
    "lastLogin": "date",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### 2. Update User Profile
- **Endpoint**: `PUT /users/profile`
- **Headers**: `user-id: USER_ID`
- **Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "location": {
    "state": "string",
    "city": "string"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user object
  }
}
```

### Course Management

#### 1. Get All Courses
- **Endpoint**: `GET /courses`
- **Response**:
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "instructor": "string",
      "duration": "number",
      "difficulty": "Beginner|Intermediate|Advanced",
      "thumbnail": "string",
      "enrollmentCount": "number",
      "rating": "number",
      "isActive": "boolean",
      "createdBy": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### 2. Get Course by ID
- **Endpoint**: `GET /courses/:id`
- **Response**:
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    // Course object
  }
}
```

#### 3. Get Lessons for Course
- **Endpoint**: `GET /courses/:courseId/lessons`
- **Response**:
```json
{
  "success": true,
  "message": "Lessons retrieved successfully",
  "data": [
    {
      "_id": "string",
      "courseId": "string",
      "title": "string",
      "content": "string",
      "videoUrl": "string",
      "duration": "number",
      "orderIndex": "number",
      "isPreview": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

### Job Management

#### 1. Get All Jobs
- **Endpoint**: `GET /jobs`
- **Response**:
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "company": "string",
      "location": "string",
      "jobType": "Full-time|Part-time|Contract|Internship",
      "salaryMin": "number",
      "salaryMax": "number",
      "requirements": ["string"],
      "skills": ["string"],
      "applicationDeadline": "date",
      "isActive": "boolean",
      "postedBy": "string",
      "applicationsCount": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### 2. Get Job by ID
- **Endpoint**: `GET /jobs/:id`
- **Response**:
```json
{
  "success": true,
  "message": "Job retrieved successfully",
  "data": {
    // Job object
  }
}
```

#### 3. Apply for Job
- **Endpoint**: `POST /jobs/apply`
- **Request Body**:
```json
{
  "jobId": "string",
  "applicantId": "string",
  "coverLetter": "string",
  "resumeUrl": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "string",
    "jobId": "string",
    "applicantId": "string",
    "coverLetter": "string",
    "resumeUrl": "string",
    "status": "Pending|Reviewed|Interview|Accepted|Rejected",
    "feedback": "string",
    "appliedDate": "date",
    "reviewedDate": "date"
  }
}
```

#### 4. Get Applications for User
- **Endpoint**: `GET /users/:userId/applications`
- **Response**:
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "data": [
    {
      // Application object with populated job details
    }
  ]
}
```

### Messaging System

#### 1. Send Message
- **Endpoint**: `POST /messages`
- **Request Body**:
```json
{
  "senderId": "string",
  "receiverId": "string",
  "content": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "string",
    "senderId": "string",
    "receiverId": "string",
    "content": "string",
    "isRead": "boolean",
    "createdAt": "date"
  }
}
```

#### 2. Get Messages Between Users
- **Endpoint**: `GET /messages/:userId1/:userId2`
- **Response**:
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": [
    {
      // Message objects sorted by createdAt
    }
  ]
}
```

#### 3. Get Unread Messages
- **Endpoint**: `GET /users/:userId/messages/unread`
- **Response**:
```json
{
  "success": true,
  "message": "Unread messages retrieved successfully",
  "data": [
    {
      // Unread message objects
    }
  ]
}
```

### Progress Tracking

#### 1. Update Progress
- **Endpoint**: `POST /progress`
- **Request Body**:
```json
{
  "userId": "string",
  "courseId": "string",
  "lessonId": "string",
  "completionStatus": "Not Started|In Progress|Completed",
  "timeSpent": "number",
  "score": "number"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "_id": "string",
    "userId": "string",
    "courseId": "string",
    "lessonId": "string",
    "completionStatus": "string",
    "completedDate": "date",
    "timeSpent": "number",
    "score": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### 2. Get Progress for User
- **Endpoint**: `GET /progress/:userId`
- **Response**:
```json
{
  "success": true,
  "message": "Progress retrieved successfully",
  "data": [
    {
      // Progress objects with populated course and lesson details
    }
  ]
}
```

#### 3. Get Course Completion Percentage
- **Endpoint**: `GET /progress/:userId/:courseId/completion`
- **Response**:
```json
{
  "success": true,
  "message": "Completion percentage calculated successfully",
  "data": {
    "percentage": "number"
  }
}
```

## UI Component Requirements

### 1. Authentication Screens
- **Login Form**: Email, password fields with validation
- **Registration Form**: All user fields with validation
- **Forgot Password**: Email field for password reset

### 2. Dashboard
- **User Profile Card**: Display user information with edit option
- **Quick Stats**: Courses enrolled, jobs applied, messages unread
- **Recent Activity**: Latest courses, jobs, messages

### 3. Course Browser
- **Course Cards**: Title, instructor, duration, rating, difficulty
- **Category Filters**: Filter courses by category
- **Search Bar**: Search courses by title or description
- **Course Detail Page**: Full course information with lessons list

### 4. Job Board
- **Job Cards**: Title, company, location, salary range, deadline
- **Job Filters**: Filter by job type, location, salary range
- **Search Bar**: Search jobs by title or company
- **Job Detail Page**: Full job description with apply button

### 5. Messaging System
- **Conversation List**: List of conversations with unread indicators
- **Message Thread**: Message bubbles with timestamps
- **Message Input**: Text input with send button
- **Online Status**: Show user online/offline status

### 6. Progress Tracking
- **Progress Bars**: Visual representation of course completion
- **Learning Analytics**: Time spent, scores, completion rates
- **Certificate Display**: Show earned certificates

## Design Guidelines

### Color Palette
- **Primary**: #2563eb (Blue for trust and security)
- **Secondary**: #10b981 (Green for growth and success)
- **Accent**: #f59e0b (Orange for energy and action)
- **Background**: #f8fafc (Light gray for clean interface)
- **Text**: #1e293b (Dark gray for readability)

### Typography
- **Headings**: Inter or Poppins (Bold, modern)
- **Body Text**: Inter or Roboto (Clean, readable)
- **Font Sizes**: 
  - H1: 36px
  - H2: 28px
  - H3: 22px
  - Body: 16px
  - Small: 14px

### Layout
- **Responsive Design**: Mobile-first approach
- **Grid System**: 12-column grid for consistent layouts
- **Spacing**: Consistent padding and margins using 8px scale
- **Breakpoints**: 
  - Mobile: 0-768px
  - Tablet: 769-1024px
  - Desktop: 1025px+

### Accessibility
- **Contrast Ratios**: Minimum 4.5:1 for text
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus States**: Clear focus indicators for interactive elements

## User Experience Requirements

### 1. Onboarding Flow
- Welcome screen explaining platform purpose
- User type selection (Youth, Mentor, Employer)
- Profile setup wizard
- Tutorial for key features

### 2. Navigation
- Persistent header with logo and main navigation
- User profile dropdown with settings
- Mobile-friendly hamburger menu
- Breadcrumb navigation for deep pages

### 3. Notifications
- Toast notifications for success/error messages
- In-app notifications for messages and updates
- Email notifications for important events
- Push notifications for mobile users

### 4. Performance
- Loading skeletons for content
- Lazy loading for images and lists
- Caching for frequently accessed data
- Optimistic updates for user actions

## Security Considerations

### 1. Authentication
- JWT token storage in HTTP-only cookies
- Token refresh mechanism
- Secure password requirements
- Account lockout after failed attempts

### 2. Data Protection
- Input validation on frontend and backend
- Sanitization of user-generated content
- HTTPS for all API requests
- CORS configuration for security

### 3. Privacy
- Clear privacy policy
- User data export/deletion options
- Consent for data processing
- GDPR compliance features

## Testing Requirements

### 1. Unit Tests
- Component rendering tests
- Form validation tests
- API integration tests
- Utility function tests

### 2. Integration Tests
- User registration and login flow
- Course enrollment and progress tracking
- Job application process
- Messaging functionality

### 3. End-to-End Tests
- Complete user journey from registration to course completion
- Job application to hiring process
- Messaging between users
- Profile management

## Deployment Considerations

### 1. Hosting
- **Frontend**: Vercel, Netlify, or Firebase Hosting
- **Backend**: Heroku, AWS, or DigitalOcean
- **Database**: MongoDB Atlas

### 2. CI/CD
- GitHub Actions for automated testing
- Deployment pipelines for staging and production
- Environment variable management
- Monitoring and logging

### 3. Monitoring
- Error tracking with Sentry
- Performance monitoring with Lighthouse
- Analytics with Google Analytics
- Uptime monitoring

## Success Metrics

### 1. User Engagement
- Daily/Monthly Active Users
- Session duration
- Feature adoption rates
- User retention

### 2. Learning Outcomes
- Course completion rates
- Quiz scores
- Certificate issuance
- Skill progression

### 3. Employment Outcomes
- Job application rates
- Interview success rates
- Employment placement rates
- Salary progression

## Future Enhancements

### 1. Mobile App
- React Native or Flutter implementation
- Push notifications
- Offline capabilities
- Biometric authentication

### 2. Advanced Features
- AI-powered course recommendations
- Video conferencing for mentorship
- Gamification elements
- Social learning features

### 3. Analytics Dashboard
- Admin dashboard for platform metrics
- User behavior analytics
- Course performance tracking
- Job market insights

This comprehensive guide provides all the information needed to create a beautiful, functional frontend that perfectly integrates with the YouthGuard backend API.