/**
 * Add Additional Courses Script
 * Adds new courses to existing database without clearing
 */

require('dotenv').config();
const mongoose = require('mongoose');
require('../src/models/Course');
const Course = mongoose.model('Course');

// New courses to add
const newCourses = [
    {
        title: "Advanced React Development",
        description: "Master advanced React concepts including hooks, context, performance optimization, and testing strategies.",
        category: "Programming",
        instructor: "Jennifer Davis",
        duration: 55,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        rating: 4.9,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        title: "DevOps and CI/CD Pipeline",
        description: "Learn Docker, Kubernetes, Jenkins, and automated deployment strategies for modern software development.",
        category: "DevOps",
        instructor: "Michael Chen",
        duration: 65,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop",
        rating: 4.7,
        createdBy: new mongoose.Types.ObjectId()
    },
    // Add more courses here...
];

async function addNewCourses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youthguard_dev');
        console.log('Connected to MongoDB');

        const addedCourses = await Course.insertMany(newCourses);
        console.log(`✅ Successfully added ${addedCourses.length} new courses`);

        addedCourses.forEach((course, index) => {
            console.log(`${index + 1}. ${course.title} - ${course.category}`);
        });

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error adding courses:', error);
        process.exit(1);
    }
}

addNewCourses();