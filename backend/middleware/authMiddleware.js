const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT
const protect = async (req, res, next) => {
    let token;
    console.log(`[AuthDebug] Headers:`, req.headers.authorization ? 'Present' : 'Missing');
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(`[AuthDebug] Token found, verifying...`);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(`[AuthDebug] Token verified, user ID: ${decoded.id}`);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                console.log(`[AuthDebug] User not found for ID: ${decoded.id}`);
                return res.status(401).json({ message: 'AUTH_ERROR: User not found in database' });
            }
            console.log(`[AuthDebug] User authorized: ${req.user.email} (${req.user.role})`);
            next();
        } catch (error) {
            console.error(`[AuthDebug] Token verification failed:`, error.message);
            return res.status(401).json({ message: `AUTH_ERROR: Token verification failed (${error.message})` });
        }
    } else {
        console.log(`[AuthDebug] No Bearer token in Authorization header`);
        return res.status(401).json({ message: 'AUTH_ERROR: No Bearer token provided' });
    }
};

// Role-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Role '${req.user.role}' is not authorized.`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
