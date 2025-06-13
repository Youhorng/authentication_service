const User = require("../models/user")
const { validationResult } = require("express-validator")

// Register a new user (admin only)
exports.register = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "error",
                message: "Email already registered"
            });
        }

        // Create new user 
        const newUser = await User.create({
            email,
            password,
            role: role || "user"
        });

        // Remove password from response 
        newUser.password = undefined;

        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
    }
};

// Login user and return JWT
exports.login = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check for user in the database
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            status: "success",
            data: {
                token,
                user: {
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
    }
}

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
      // req.user comes from auth middleware
      const user = await User.findById(req.user.id);
  
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Server error'
      });
    }
  };