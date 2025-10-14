/**
 * Application Model for YouthGuard MVP
 * 
 * This model represents job applications in the YouthGuard platform.
 */

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SimpleUser',
        required: true
    },
    
    coverLetter: {
        type: String,
        required: true
    },
    
    resumeUrl: {
        type: String, // URL to resume file
        required: true
    },
    
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    
    feedback: {
        type: String,
        default: ''
    },
    
    appliedDate: {
        type: Date,
        default: Date.now
    },
    
    reviewedDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'applications'
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
