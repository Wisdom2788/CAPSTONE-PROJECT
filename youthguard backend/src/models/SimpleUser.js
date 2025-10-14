/**
 * Simple User Model for YouthGuard MVP
 * 
 * This is a simplified version of the User model focusing on core functionality.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Simple User Schema
 */
const simpleUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    
    phoneNumber: {
        type: String,
        required: true
    },
    
    dateOfBirth: {
        type: Date,
        required: true
    },
    
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    
    location: {
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    },
    
    userType: {
        type: String,
        required: true,
        default: 'Youth'
    },
    
    accountStatus: {
        type: String,
        enum: ['pending', 'active', 'suspended', 'deactivated'],
        default: 'active'
    },
    
    lastLogin: {
        type: Date,
        default: null
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
    collection: 'simple_users'
});

/**
 * Hash password before saving
 */
simpleUserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare password for authentication
 */
simpleUserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT token
 */
simpleUserSchema.methods.generateAuthToken = function() {
    const payload = {
        id: this._id,
        email: this.email,
        userType: this.userType
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'youthguard_jwt_secret', {
        expiresIn: '24h'
    });
};

/**
 * Remove sensitive data when converting to JSON
 */
simpleUserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

const SimpleUser = mongoose.model('SimpleUser', simpleUserSchema);

module.exports = SimpleUser;