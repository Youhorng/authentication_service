const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define user schema 
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'            
        ]
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false // Do not return password in queries
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "users_credential"
});

// Hash password before saving
UserSchema.pre.pre("save", async function(next) {
    // Only hash if password is modified or new
    if (!this.isModified("password")) {
        next();
        return;
    }

    // Generate salt and hash password 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        
        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRE || '24h' // Default expiration time
        }
    );
};

// Method to match passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model("User", UserSchema)

