module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  res.status(statusCode).json({
    success: false,
    message,
    details
  });
};


