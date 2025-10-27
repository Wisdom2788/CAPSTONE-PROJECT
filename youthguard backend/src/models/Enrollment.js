/**
 * Enrollment Model for YouthGuard MVP
 * 
 * This model tracks user enrollments in courses.
 */

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
    
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped', 'paused'],
        default: 'active'
    },
    
    completionDate: {
        type: Date,
        default: null
    },
    
    progressPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'enrollments'
});

// Compound index to ensure unique enrollment per user per course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Index for efficient queries
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1, status: 1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;