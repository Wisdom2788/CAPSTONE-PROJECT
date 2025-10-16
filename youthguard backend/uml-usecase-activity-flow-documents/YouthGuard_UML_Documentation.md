# YouthGuard Platform - UML Documentation

This document provides an overview of the UML diagrams created for the YouthGuard platform, which align with the features described in the EXPANDED_MVP_SUMMARY.md documentation.

## Activity Diagrams

### 1. User Registration & Authentication Flow
**File**: `YouthGuard_Activity_Overview.puml`

This diagram illustrates the complete user onboarding process:
- User registration with email verification
- Account activation process
- User authentication and session establishment

### 2. Learning Management Flow
**File**: `YouthGuard_Activity_Learning.puml`

This diagram shows the learning journey of a user:
- Course browsing and filtering
- Course enrollment process
- Lesson interaction and progress tracking

### 3. Job Application Flow
**File**: `YouthGuard_Activity_JobApplication.puml`

This diagram depicts the job application process:
- Job browsing and searching
- Job detail viewing
- Application submission workflow

### 4. Messaging Flow
**File**: `YouthGuard_Activity_Messaging.puml`

This diagram outlines the messaging system:
- Conversation management
- Message sending and delivery
- Real-time notifications

### 5. Progress Tracking Flow
**File**: `YouthGuard_Activity_ProgressTracking.puml`

This diagram explains the progress tracking mechanism:
- Dashboard statistics calculation
- Course progress visualization
- Detailed progress reporting

## Use Case Diagram

**File**: `YouthGuard_UseCase_Diagram.puml`

This diagram represents the functional requirements of the system:
- Four types of actors (Youth User, Mentor, Employer, Admin)
- Core functionalities for each user type
- System boundaries and interactions

Key use cases include:
- **Youth Users**: Register, login, browse courses/jobs, apply for jobs, track progress, communicate
- **Mentors**: Create courses, manage content, view student progress
- **Employers**: Post jobs, review applications, schedule interviews
- **Admins**: Manage all system aspects, generate reports

## Class Diagram

**File**: `YouthGuard_Class_Diagram.puml`

This diagram shows the system's data model and relationships:
- Core entities: User, Course, Lesson, Job, Application, Message
- Supporting entities: Location, Enrollment, Progress, Conversation
- Relationships and cardinalities between entities

Key relationships:
- Users have locations and can enroll in courses
- Courses contain multiple lessons
- Users make progress on lessons within courses
- Users apply for jobs
- Users send messages within conversations

## How to View These Diagrams

To view these diagrams, you can:

1. **Use PlantUML**: Install PlantUML and render the .puml files
2. **Online Renderers**: Use online PlantUML editors like PlantText or www.plantuml.com/plantuml
3. **IDE Plugins**: Use PlantUML plugins for VS Code, IntelliJ, or other IDEs

## Relationship to EXPANDED_MVP_SUMMARY.md

These diagrams directly correspond to the five core functionality areas mentioned in the MVP documentation:

1. **User Management** - Covered in Activity Overview and Use Case diagrams
2. **Course Management** - Covered in Learning Activity and Class diagrams
3. **Job Management** - Covered in Job Application Activity and Use Case diagrams
4. **Messaging System** - Covered in Messaging Activity and Use Case diagrams
5. **Progress Tracking** - Covered in Progress Tracking Activity and Class diagrams

Each diagram provides a visual representation of the workflows, interactions, and data structures that support these core features.