/**
 * User Model for YouthGuard MVP
 * 
 * This file defines the User schema and its specialized subclasses.
 * This implements single table inheritance pattern using Mongoose discriminators.
 * 
 * Key Concepts Explained:
 * 1. Mongoose Schema: Defines the structure and validation rules for documents
 * 2. Discriminators: Allows inheritance in MongoDB (one collection, multiple types)
 * 3. Virtual Fields: Computed properties that don't exist in the database
 * 4. Instance Methods: Functions that operate on individual documents
 * 5. Static Methods: Functions that operate on the model class
 * 6. Middleware: Functions that run before/after certain operations
 * 7. Indexing: Database optimization for faster queries
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Base User Schema
 * 
 * This defines the common fields and methods for all user types.
 * All user types (Youth, Mentor, Employer, Admin) inherit from this base schema.
 */
const userSchema = new mongoose.Schema({
    /**
     * Basic Information Fields
     * 
     * These fields are common to all user types.
     */
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                // Email validation regex
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Please provide a valid email address'
        }
    },
    
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(password) {
                // Password strength validation
                // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);
            },
            message: 'Password must contain at least 8 characters with uppercase, lowercase, and number'
        },
        select: false // Don't include password in queries by default
    },
    
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(phone) {
                // Nigerian phone number validation
                return /^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/\s+/g, ''));
            },
            message: 'Please provide a valid Nigerian phone number'
        }
    },
    
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function(date) {
                // Must be at least 16 years old
                const minAge = new Date();
                minAge.setFullYear(minAge.getFullYear() - 16);
                return date <= minAge;
            },
            message: 'Must be at least 16 years old'
        }
    },
    
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female', 'other'],
            message: 'Gender must be male, female, or other'
        }
    },
    
    /**
     * Location Fields
     */
    location: {
        state: {
            type: String,
            required: [true, 'State is required'],
            enum: {
                values: [
                    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
                    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
                    'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
                    'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
                    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
                    'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
                ],
                message: 'Please select a valid Nigerian state'
            }
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    },
    
    /**
     * Profile Fields
     */
    profilePicture: {
        type: String,
        default: null,
        validate: {
            validator: function(url) {
                if (!url) return true; // Optional field
                // Basic URL validation
                return /^(https?:\/\/)|(\/)/.test(url);
            },
            message: 'Profile picture must be a valid URL or file path'
        }
    },
    
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        trim: true
    },
    
    /**
     * Account Status Fields
     */
    isActive: {
        type: Boolean,
        default: true
    },
    
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    
    accountStatus: {
        type: String,
        enum: {
            values: ['pending', 'active', 'suspended', 'deactivated'],
            message: 'Invalid account status'
        },
        default: 'pending'
    },
    
    /**
     * Verification Fields
     */
    emailVerificationToken: {
        type: String,
        select: false
    },
    
    emailVerificationExpires: {
        type: Date,
        select: false
    },
    
    passwordResetToken: {
        type: String,
        select: false
    },
    
    passwordResetExpires: {
        type: Date,
        select: false
    },
    
    /**
     * Security Fields
     */
    lastLogin: {
        type: Date,
        default: null
    },
    
    loginAttempts: {
        type: Number,
        default: 0
    },
    
    lockUntil: {
        type: Date,
        default: null
    },
    
    /**
     * Tracking Fields
     */
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
    /**
     * Discriminator Key
     * 
     * This field determines the user type (Youth, Mentor, Employer, Admin).
     * Mongoose uses this for the discriminator pattern.
     */
    userType: {
        type: String,
        required: true,
        enum: ['Youth', 'Mentor', 'Employer', 'Administrator']
    }
}, {
    /**
     * Schema Options
     */
    timestamps: true, // Automatically manage createdAt and updatedAt
    discriminatorKey: 'userType', // Field used for inheritance
    collection: 'users' // All user types stored in 'users' collection
});

/**
 * Indexes for Performance
 * 
 * These indexes speed up common queries.
 */
userSchema.index({ userType: 1 }); // Filter by user type
userSchema.index({ 'location.state': 1 }); // Location-based queries
userSchema.index({ accountStatus: 1 }); // Active users
userSchema.index({ createdAt: -1 }); // Recent users

/**
 * Virtual Fields
 * 
 * These are computed properties that don't exist in the database.
 */

// Full name virtual
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Age virtual
userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Account locked virtual
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

/**
 * Pre-save Middleware
 * 
 * These functions run before documents are saved to the database.
 */

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash password if it's been modified (or new)
    if (!this.isModified('password')) return next();
    
    try {
        // Generate salt and hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Update timestamp before saving
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

/**
 * Instance Methods
 * 
 * These methods are available on individual user documents.
 */

/**
 * Compare password for authentication
 * 
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if password matches
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) {
        throw new Error('User password not available for comparison');
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT token
 * 
 * @returns {string} - Signed JWT token
 */
userSchema.methods.generateAuthToken = function() {
    const payload = {
        id: this._id,
        email: this.email,
        userType: this.userType,
        fullName: this.fullName
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

/**
 * Generate email verification token
 * 
 * @returns {string} - Verification token
 */
userSchema.methods.generateEmailVerificationToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set token and expiry (24 hours)
    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    return token; // Return unhashed token to send in email
};

/**
 * Generate password reset token
 * 
 * @returns {string} - Reset token
 */
userSchema.methods.generatePasswordResetToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set token and expiry (1 hour)
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    
    return token; // Return unhashed token to send in email
};

/**
 * Record login attempt
 * 
 * @param {boolean} successful - Whether login was successful
 */
userSchema.methods.recordLoginAttempt = async function(successful) {
    if (successful) {
        // Reset failed attempts and lock
        this.loginAttempts = 0;
        this.lockUntil = null;
        this.lastLogin = new Date();
    } else {
        // Increment failed attempts
        this.loginAttempts += 1;
        
        // Lock account after 5 failed attempts
        if (this.loginAttempts >= 5) {
            this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        }
    }
    
    await this.save();
};

/**
 * Verify email
 */
userSchema.methods.verifyEmail = async function() {
    this.isEmailVerified = true;
    this.emailVerificationToken = undefined;
    this.emailVerificationExpires = undefined;
    this.accountStatus = 'active';
    await this.save();
};

/**
 * Static Methods
 * 
 * These methods are available on the User model class.
 */

/**
 * Find user by email verification token
 * 
 * @param {string} token - Verification token
 * @returns {Promise<User|null>} - User document or null
 */
userSchema.statics.findByEmailVerificationToken = function(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    return this.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() }
    });
};

/**
 * Find user by password reset token
 * 
 * @param {string} token - Reset token
 * @returns {Promise<User|null>} - User document or null
 */
userSchema.statics.findByPasswordResetToken = function(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    return this.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
};

/**
 * Get user statistics
 * 
 * @returns {Promise<Object>} - User statistics
 */
userSchema.statics.getStatistics = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$userType',
                count: { $sum: 1 },
                active: {
                    $sum: {
                        $cond: [{ $eq: ['$accountStatus', 'active'] }, 1, 0]
                    }
                }
            }
        }
    ]);
    
    return stats;
};

/**
 * JSON Transform
 * 
 * Control what fields are included when converting to JSON.
 */
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    
    // Remove sensitive fields
    delete userObject.password;
    delete userObject.emailVerificationToken;
    delete userObject.emailVerificationExpires;
    delete userObject.passwordResetToken;
    delete userObject.passwordResetExpires;
    delete userObject.loginAttempts;
    delete userObject.lockUntil;
    delete userObject.__v;
    
    return userObject;
};

/**
 * Create and export the base User model
 */
const User = mongoose.model('User', userSchema);

module.exports = User;