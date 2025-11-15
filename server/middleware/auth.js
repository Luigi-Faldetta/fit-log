const { clerkMiddleware, requireAuth } = require('@clerk/express');

/**
 * Clerk authentication middleware
 * This validates the JWT token from Clerk and attaches user info to req.auth
 */
const clerkAuth = clerkMiddleware();

/**
 * Middleware to require authentication
 * Returns 401 if no valid auth token is present
 */
const requireAuthentication = requireAuth();

/**
 * Optional authentication middleware
 * Doesn't fail if no auth token, but validates it if present
 */
const optionalAuth = (req, res, next) => {
  // If there's an Authorization header, validate it
  if (req.headers.authorization) {
    return clerkAuth(req, res, next);
  }
  // Otherwise, continue without auth
  next();
};

/**
 * Middleware to check if user is authorized to access a resource
 * @param {Function} getUserIdFromResource - Function to extract userId from the resource
 */
const checkResourceOwnership = (getUserIdFromResource) => {
  return async (req, res, next) => {
    try {
      // Get the authenticated user's ID from Clerk
      const authUserId = req.auth?.userId;

      if (!authUserId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get the resource owner's user ID
      const resourceUserId = await getUserIdFromResource(req);

      // Check if the authenticated user owns the resource
      if (authUserId !== resourceUserId) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to access this resource'
        });
      }

      next();
    } catch (error) {
      console.error('Authorization check failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Authorization check failed'
      });
    }
  };
};

module.exports = {
  clerkAuth,
  requireAuthentication,
  optionalAuth,
  checkResourceOwnership
};
