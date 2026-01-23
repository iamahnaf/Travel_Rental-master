// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

// Not found middleware
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};