const authorizeRole = (role) => {
    return (req, res, next) => {
        const user = req.user; // Assuming user information is available in the request

        if (user.role === role) {
            next(); // User has the required role, continue to the route
        } else {
            res.status(403).json({ error: 'Unauthorized: Insufficient role permissions' });
        }
    };
};

module.exports = authorizeRole;