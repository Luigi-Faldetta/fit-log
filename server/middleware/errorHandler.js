/**
 * Custom Error Classes
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Operational errors are expected and handled
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Global error handling middleware
 * This should be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (only in development or if LOG_ERRORS is true)
  if (process.env.NODE_ENV !== 'production' || process.env.LOG_ERRORS === 'true') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      ...error
    });
  } else {
    // Minimal logging in production
    console.error('Error:', err.message);
  }

  // Sequelize/Database errors
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = new ValidationError(message);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = new ValidationError(message);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Invalid reference to related resource';
    error = new ValidationError(message);
  }

  // Sequelize DatabaseError
  if (err.name === 'SequelizeDatabaseError') {
    error = new AppError('Database error occurred', 500);
  }

  // Clerk authentication errors
  if (err.message && err.message.includes('Unauthenticated')) {
    error = new UnauthorizedError();
  }

  // Cast errors (invalid ID format)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ValidationError(message);
  }

  // JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new ValidationError('Invalid JSON in request body');
  }

  // Default to 500 server error
  const statusCode = err.statusCode || error.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      details: error
    })
  });
};

/**
 * Catch 404 and forward to error handler
 */
const notFound = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Database connection check middleware
 * Returns 503 if database is not connected
 */
const requireDatabase = (req, res, next) => {
  if (!global.dbConnected) {
    return res.status(503).json({
      success: false,
      error: 'Service temporarily unavailable - database not connected'
    });
  }
  next();
};

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  errorHandler,
  notFound,
  asyncHandler,
  requireDatabase
};
