/**
 * Course Model for YouthGuard MVP
 * 
 * This model represents educational courses in the YouthGuard platform.
 */

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    description: {
        type: String,
        required: true
    },
    
    category: {
        type: String,
        required: true,
        trim: true
    },
    
    instructor: {
        type: String,
        required: true,
        trim: true
    },
    
    duration: {
        type: Number, // in hours
        required: true
    },
    
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    
    thumbnail: {
        type: String, // URL to thumbnail image
        default: null
    },
    
    enrollmentCount: {
        type: Number,
        default: 0
    },
    
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SimpleUser',
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'courses'
});

// Update timestamp before saving
courseSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
