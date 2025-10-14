/**
 * Youth Model for YouthGuard MVP
 * 
 * This model extends the base User model to add Youth-specific fields and methods.
 * Youth are the primary users of the platform seeking skills and employment.
 * 
 * Key Concepts Explained:
 * 1. Mongoose Discriminators: Inheritance pattern for MongoDB
 * 2. Schema Extension: Adding fields specific to Youth users
 * 3. Embedded Documents: Complex data structures within documents
 * 4. Array Fields: Storing multiple related items
 * 5. Computed Fields: Values calculated from other fields
 * 6. Business Logic: Youth-specific functionality
 */

const mongoose = require('mongoose');
const User = require('./User');

/**
 * Youth-specific Schema Extension
 * 
 * This schema adds fields that are specific to Youth users.
 * It extends the base User schema using Mongoose discriminators.
 */
const youthSchema = new mongoose.Schema({
    /**
     * Educational Background
     */
    education: {
        highestLevel: {
            type: String,
            required: [true, 'Education level is required'],
            enum: {
                values: [
                    'primary',
                    'junior_secondary', 
                    'senior_secondary',
                    'ond', // Ordinary National Diploma
                    'hnd', // Higher National Diploma
                    'bachelor',
                    'master',
                    'phd',
                    'other'
                ],
                message: 'Please select a valid education level'
            }
        },
        
        institution: {
            type: String,
            trim: true,
            maxlength: [100, 'Institution name cannot exceed 100 characters']
        },
        
        fieldOfStudy: {
            type: String,
            trim: true,
            maxlength: [100, 'Field of study cannot exceed 100 characters']
        },
        
        graduationYear: {
            type: Number,
            min: [1990, 'Graduation year cannot be before 1990'],
            max: [new Date().getFullYear() + 6, 'Graduation year cannot be more than 6 years in the future']
        },
        
        cgpa: {
            type: Number,
            min: [0, 'CGPA cannot be negative'],
            max: [5.0, 'CGPA cannot exceed 5.0']
        }
    },
    
    /**
     * Employment Information
     */
    employment: {
        status: {
            type: String,
            required: [true, 'Employment status is required'],
            enum: {
                values: ['unemployed', 'part_time', 'full_time', 'self_employed', 'student'],
                message: 'Please select a valid employment status'
            },
            default: 'unemployed'
        },
        
        currentRole: {
            type: String,
            trim: true,
            maxlength: [100, 'Current role cannot exceed 100 characters']
        },
        
        currentCompany: {
            type: String,
            trim: true,
            maxlength: [100, 'Company name cannot exceed 100 characters']
        },
        
        experienceYears: {
            type: Number,
            min: [0, 'Experience years cannot be negative'],
            max: [50, 'Experience years cannot exceed 50'],
            default: 0
        },
        
        desiredSalary: {
            min: {
                type: Number,
                min: [0, 'Minimum salary cannot be negative']
            },
            max: {
                type: Number,
                min: [0, 'Maximum salary cannot be negative']
            },
            currency: {
                type: String,
                enum: ['NGN', 'USD'],
                default: 'NGN'
            }
        }
    },
    
    /**
     * Skills and Interests
     */
    skills: [{
        name: {
            type: String,
            required: [true, 'Skill name is required'],
            trim: true
        },
        level: {
            type: String,
            enum: {
                values: ['beginner', 'intermediate', 'advanced', 'expert'],
                message: 'Skill level must be beginner, intermediate, advanced, or expert'
            },
            required: [true, 'Skill level is required']
        },
        yearsOfExperience: {
            type: Number,
            min: [0, 'Years of experience cannot be negative'],
            default: 0
        },
        certifications: [{
            name: String,
            issuedBy: String,
            issuedDate: Date,
            expiryDate: Date,
            credentialId: String,
            verificationUrl: String
        }]
    }],
    
    interests: [{
        type: String,
        trim: true,
        enum: {
            values: [
                'cybersecurity',
                'web_development',
                'mobile_development',
                'data_science',
                'artificial_intelligence',
                'blockchain',
                'digital_marketing',
                'graphic_design',
                'content_creation',
                'e_commerce',
                'fintech',
                'edtech',
                'healthtech',
                'agtech',
                'other'
            ],
            message: 'Please select valid interests'
        }
    }],
    
    /**
     * Career Preferences
     */
    careerPreferences: {
        jobTypes: [{
            type: String,
            enum: ['full_time', 'part_time', 'contract', 'internship', 'freelance']
        }],
        
        workArrangement: [{
            type: String,
            enum: ['remote', 'on_site', 'hybrid']
        }],
        
        preferredLocations: [{
            state: String,
            city: String
        }],
        
        willingToRelocate: {
            type: Boolean,
            default: false
        }
    },
    
    /**
     * Portfolio and Documents
     */
    portfolio: {
        website: {
            type: String,
            validate: {
                validator: function(url) {
                    if (!url) return true; // Optional field
                    return /^(https?:\/\/)/.test(url);
                },
                message: 'Website must be a valid URL starting with http:// or https://'
            }
        },
        
        github: {
            type: String,
            validate: {
                validator: function(url) {
                    if (!url) return true; // Optional field
                    return /^https:\/\/github\.com\//.test(url);
                },
                message: 'GitHub URL must be a valid GitHub profile URL'
            }
        },
        
        linkedin: {
            type: String,
            validate: {
                validator: function(url) {
                    if (!url) return true; // Optional field
                    return /^https:\/\/www\.linkedin\.com\/in\//.test(url);
                },
                message: 'LinkedIn URL must be a valid LinkedIn profile URL'
            }
        },
        
        resume: {
            type: String, // File path or URL
            validate: {
                validator: function(path) {
                    if (!path) return true; // Optional field
                    return /\.(pdf|doc|docx)$/i.test(path);
                },
                message: 'Resume must be a PDF, DOC, or DOCX file'
            }
        },
        
        projects: [{
            title: {
                type: String,
                required: [true, 'Project title is required'],
                trim: true,
                maxlength: [100, 'Project title cannot exceed 100 characters']
            },
            description: {
                type: String,
                required: [true, 'Project description is required'],
                trim: true,
                maxlength: [500, 'Project description cannot exceed 500 characters']
            },
            technologies: [{
                type: String,
                trim: true
            }],
            url: {
                type: String,
                validate: {
                    validator: function(url) {
                        if (!url) return true;
                        return /^(https?:\/\/)/.test(url);
                    },
                    message: 'Project URL must be valid'
                }
            },
            githubUrl: {
                type: String,
                validate: {
                    validator: function(url) {
                        if (!url) return true;
                        return /^https:\/\/github\.com\//.test(url);
                    },
                    message: 'GitHub URL must be valid'
                }
            },
            startDate: {
                type: Date,
                required: [true, 'Project start date is required']
            },
            endDate: {
                type: Date,
                validate: {
                    validator: function(endDate) {
                        if (!endDate) return true; // Optional for ongoing projects
                        return endDate >= this.startDate;
                    },
                    message: 'End date must be after start date'
                }
            },
            isOngoing: {
                type: Boolean,
                default: false
            }
        }]
    },
    
    /**
     * Learning Progress
     */
    learningProgress: {
        coursesEnrolled: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        
        coursesCompleted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        
        certificatesEarned: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Certificate'
        }],
        
        totalLearningHours: {
            type: Number,
            default: 0,
            min: [0, 'Learning hours cannot be negative']
        },
        
        currentLearningGoals: [{
            skill: String,
            targetLevel: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert']
            },
            deadline: Date,
            progress: {
                type: Number,
                min: 0,
                max: 100,
                default: 0
            }
        }]
    },
    
    /**
     * Job Application History
     */
    jobApplications: {
        applied: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }],
        
        interviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }],
        
        offers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }],
        
        hired: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }]
    },
    
    /**
     * Mentorship
     */
    mentorship: {
        currentMentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        
        previousMentors: [{
            mentor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            startDate: Date,
            endDate: Date,
            rating: {
                type: Number,
                min: 1,
                max: 5
            },
            feedback: String
        }],
        
        mentorshipPreferences: {
            areas: [{
                type: String,
                enum: [
                    'career_guidance',
                    'technical_skills',
                    'interview_preparation',
                    'portfolio_development',
                    'networking',
                    'entrepreneurship'
                ]
            }],
            
            meetingFrequency: {
                type: String,
                enum: ['weekly', 'bi_weekly', 'monthly'],
                default: 'bi_weekly'
            },
            
            preferredMeetingType: {
                type: String,
                enum: ['video_call', 'voice_call', 'in_person', 'text_chat'],
                default: 'video_call'
            }
        }
    },
    
    /**
     * Activity and Engagement
     */
    activity: {
        profileViews: {
            type: Number,
            default: 0
        },
        
        searchAppearances: {
            type: Number,
            default: 0
        },
        
        messagesReceived: {
            type: Number,
            default: 0
        },
        
        responseRate: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        
        lastActiveDate: {
            type: Date,
            default: Date.now
        }
    },
    
    /**
     * Risk Assessment (for cybercrime prevention)
     */
    riskAssessment: {
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        },
        
        riskFactors: [{
            factor: String,
            severity: {
                type: String,
                enum: ['low', 'medium', 'high']
            },
            detectedDate: {
                type: Date,
                default: Date.now
            }
        }],
        
        interventionHistory: [{
            type: {
                type: String,
                enum: ['counseling', 'mentorship', 'training', 'referral']
            },
            date: {
                type: Date,
                default: Date.now
            },
            provider: String,
            outcome: String,
            notes: String
        }]
    }
}, {
    timestamps: true
});

/**
 * Indexes for Youth-specific queries
 */
youthSchema.index({ 'employment.status': 1 });
youthSchema.index({ 'skills.name': 1 });
youthSchema.index({ interests: 1 });
youthSchema.index({ 'careerPreferences.preferredLocations.state': 1 });
youthSchema.index({ 'activity.lastActiveDate': -1 });
youthSchema.index({ 'riskAssessment.riskLevel': 1 });

/**
 * Virtual Fields
 */

// Profile completion percentage
youthSchema.virtual('profileCompletionPercentage').get(function() {
    let completedFields = 0;
    const totalFields = 10;
    
    // Check required fields
    if (this.education?.highestLevel) completedFields++;
    if (this.employment?.status) completedFields++;
    if (this.skills?.length > 0) completedFields++;
    if (this.interests?.length > 0) completedFields++;
    if (this.bio) completedFields++;
    if (this.profilePicture) completedFields++;
    if (this.portfolio?.resume) completedFields++;
    if (this.careerPreferences?.jobTypes?.length > 0) completedFields++;
    if (this.careerPreferences?.workArrangement?.length > 0) completedFields++;
    if (this.portfolio?.projects?.length > 0) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
});

// Job application success rate
youthSchema.virtual('applicationSuccessRate').get(function() {
    const totalApplications = this.jobApplications?.applied?.length || 0;
    const successfulApplications = this.jobApplications?.hired?.length || 0;
    
    if (totalApplications === 0) return 0;
    return Math.round((successfulApplications / totalApplications) * 100);
});

// Skill level distribution
youthSchema.virtual('skillLevelDistribution').get(function() {
    const distribution = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    
    this.skills?.forEach(skill => {
        if (distribution[skill.level] !== undefined) {
            distribution[skill.level]++;
        }
    });
    
    return distribution;
});

/**
 * Instance Methods
 */

/**
 * Add a new skill
 * 
 * @param {Object} skillData - Skill information
 * @returns {Promise} - Saves the document
 */
youthSchema.methods.addSkill = async function(skillData) {
    // Check if skill already exists
    const existingSkill = this.skills.find(skill => 
        skill.name.toLowerCase() === skillData.name.toLowerCase()
    );
    
    if (existingSkill) {
        throw new Error('Skill already exists');
    }
    
    this.skills.push(skillData);
    return await this.save();
};

/**
 * Update skill level
 * 
 * @param {string} skillName - Name of the skill to update
 * @param {string} newLevel - New skill level
 * @returns {Promise} - Saves the document
 */
youthSchema.methods.updateSkillLevel = async function(skillName, newLevel) {
    const skill = this.skills.find(skill => 
        skill.name.toLowerCase() === skillName.toLowerCase()
    );
    
    if (!skill) {
        throw new Error('Skill not found');
    }
    
    skill.level = newLevel;
    return await this.save();
};

/**
 * Add learning goal
 * 
 * @param {Object} goalData - Learning goal information
 * @returns {Promise} - Saves the document
 */
youthSchema.methods.addLearningGoal = async function(goalData) {
    this.learningProgress.currentLearningGoals.push(goalData);
    return await this.save();
};

/**
 * Update learning goal progress
 * 
 * @param {string} goalId - Goal ID
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise} - Saves the document
 */
youthSchema.methods.updateLearningProgress = async function(goalId, progress) {
    const goal = this.learningProgress.currentLearningGoals.id(goalId);
    
    if (!goal) {
        throw new Error('Learning goal not found');
    }
    
    goal.progress = Math.min(100, Math.max(0, progress));
    return await this.save();
};

/**
 * Record activity
 * 
 * @param {string} activityType - Type of activity
 */
youthSchema.methods.recordActivity = async function(activityType) {
    this.activity.lastActiveDate = new Date();
    
    switch (activityType) {
        case 'profile_view':
            this.activity.profileViews += 1;
            break;
        case 'search_appearance':
            this.activity.searchAppearances += 1;
            break;
        case 'message_received':
            this.activity.messagesReceived += 1;
            break;
    }
    
    return await this.save();
};

/**
 * Static Methods
 */

/**
 * Find youth by skills
 * 
 * @param {Array} skillNames - Array of skill names
 * @param {string} minLevel - Minimum skill level
 * @returns {Promise<Array>} - Array of youth documents
 */
youthSchema.statics.findBySkills = function(skillNames, minLevel = 'beginner') {
    const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    const minLevelIndex = levelOrder.indexOf(minLevel);
    const validLevels = levelOrder.slice(minLevelIndex);
    
    return this.find({
        'skills': {
            $elemMatch: {
                'name': { $in: skillNames },
                'level': { $in: validLevels }
            }
        }
    });
};

/**
 * Find youth by location and interests
 * 
 * @param {string} state - State name
 * @param {Array} interests - Array of interests
 * @returns {Promise<Array>} - Array of youth documents
 */
youthSchema.statics.findByLocationAndInterests = function(state, interests) {
    return this.find({
        'location.state': state,
        'interests': { $in: interests },
        'accountStatus': 'active'
    });
};

/**
 * Get youth statistics
 * 
 * @returns {Promise<Object>} - Youth statistics
 */
youthSchema.statics.getYouthStatistics = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalYouth: { $sum: 1 },
                activeYouth: {
                    $sum: {
                        $cond: [{ $eq: ['$accountStatus', 'active'] }, 1, 0]
                    }
                },
                employedYouth: {
                    $sum: {
                        $cond: [
                            { $in: ['$employment.status', ['full_time', 'part_time', 'self_employed']] },
                            1, 0
                        ]
                    }
                },
                avgProfileCompletion: { $avg: '$profileCompletionPercentage' }
            }
        }
    ]);
    
    return stats[0] || {};
};

/**
 * Create the Youth model using discriminator
 */
const Youth = User.discriminator('Youth', youthSchema);

module.exports = Youth;