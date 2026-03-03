/**
 * Generic Authentication Middleware (Works for Merchant & Mobile)
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ success: false, error: 'Invalid or Expired Token' });
    }
};

/**
 * Pilot-only Access Control
 */
const requirePilot = (req, res, next) => {
    if (!req.user || !req.user.is_pilot) {
        return res.status(403).json({ success: false, error: 'Forbidden: Pilot access required' });
    }
    next();
};

/**
 * Middleware for Role-Based Access Control (RBAC).
 */
const authorizeRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: 'Forbidden: Insufficient Permissions' });
        }
        next();
    };
};

module.exports = { authenticate, authenticateMerchant: authenticate, authorizeRole, requirePilot };
