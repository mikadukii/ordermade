const adminCheck = (req, res, next) => {
    try {
        // Check if the user has admin role
        if (!req.user || req.user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admins only.' 
            });
        } 
        next();
    } catch (error) {
        console.error('Admin Check Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error checking admin role',
            error: error.message
        });
    }
};

module.exports = adminCheck;