// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: err.message 
    });
  }

  if (err.name === 'AuthenticationError') {
    return res.status(401).json({ 
      error: 'Authentication Error', 
      details: err.message 
    });
  }
  
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({ 
      error: 'Database Error', 
      details: err.message 
    });
  }
  
  // Default error
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;
