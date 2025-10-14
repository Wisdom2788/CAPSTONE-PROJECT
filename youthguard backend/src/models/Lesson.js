/**
 * Lesson Model for YouthGuard MVP
 * 
 * This model represents individual lessons within courses.
 */

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    content: {
        type: String,
        required: true
    },
    
    videoUrl: {
        type: String, // URL to video content
        default: null
    },
    
    duration: {
        type: Number, // in minutes
        required: true
    },
    
    orderIndex: {
        type: Number,
        required: true
    },
    
    isPreview: {
        type: Boolean,
        default: false
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
    collection: 'lessons'
});

// Update timestamp before saving
lessonSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;