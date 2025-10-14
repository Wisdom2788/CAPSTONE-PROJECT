/**
 * Job Model for YouthGuard MVP
 * 
 * This model represents job postings in the YouthGuard platform.
 */

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    description: {
        type: String,
        required: true
    },
    
    company: {
        type: String,
        required: true,
        trim: true
    },
    
    location: {
        type: String,
        required: true,
        trim: true
    },
    
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: true
    },
    
    salaryMin: {
        type: Number,
        default: 0
    },
    
    salaryMax: {
        type: Number
    },
    
    requirements: {
        type: [String],
        default: []
    },
    
    skills: {
        type: [String],
        default: []
    },
    
    applicationDeadline: {
        type: Date,
        required: true
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SimpleUser',
        required: true
    },
    
    applicationsCount: {
        type: Number,
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
    collection: 'jobs'
});

// Update timestamp before saving
jobSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
