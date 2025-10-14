# YouthGuard Simple Backend

A simplified backend implementation for the YouthGuard platform to reduce youth involvement in fraud and cybercrime in Nigeria.

## Overview

This is a simplified version of the YouthGuard backend that follows Clean Code principles by Robert C. Martin and implements a clean layered architecture with:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Define data structures and validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running instance)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/youthguard_dev
   JWT_SECRET=your_jwt_secret_key
   ```

## Running the Application

Start the server:
```bash
node src/simple-server.js
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Health Check
- `GET /health` - Check if the server is running

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with existing credentials

### User Profile
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

## Example Usage

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "phoneNumber": "+2348123456789",
    "dateOfBirth": "2000-01-01",
    "gender": "male",
    "location": {
      "state": "Lagos",
      "city": "Ikeja"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

## Architecture

The backend follows a clean layered architecture:

```
Request → Controller → Service → Model → Database
Response ← Controller ← Service ← Model ← Database
```

Each layer has a specific responsibility:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic
- **Models**: Handle data structure and validation

## Testing

Run the provided test script to verify all endpoints work correctly:
```bash
node final-simple-test.js
```

## Clean Code Principles

This implementation follows Clean Code principles by Robert C. Martin:
- Meaningful names
- Small, focused functions
- Single responsibility principle
- Clear error handling
- Comprehensive documentation

## Contributing

This is a simplified version focused on core functionality. For enhancements, please refer to the main project architecture.