const jwt = require("jsonwebtoken");
const userSchema = require("../models/userSchema");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Middleware to validate token and set req.user
const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization; // Extract token

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: Token not provided' });
        return;
    }

    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        const user = await userSchema.findOne({ username: decodedToken.username });

        if (!user) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }

        req.user = user; // Attach the complete user object

        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateToken;