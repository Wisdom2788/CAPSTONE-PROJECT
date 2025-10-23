/**
 * Progress Model for YouthGuard MVP
 * 
 * This model tracks user progress through courses and lessons.
 */

const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SimpleUser',
        required: true
    },
    
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    

    
    completionStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    
    completedDate: {
        type: Date,
        default: null
    },
    
    timeSpent: {
        type: Number, // in minutes
        default: 0
    },
    
    score: {
        type: Number, // percentage
        min: 0,
        max: 100,
        default: 0
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
    collection: 'progress'
});

// Update timestamp before saving
progressSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
