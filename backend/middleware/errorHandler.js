function notFound(req, res, next) {
  res
    .status(404)
    .json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);
  const statusCode =
    err.statusCode ||
    (err.name === "ValidationError" || err.name === "CastError"
      ? 400
      : err.code === 11000
        ? 409
        : err.name === "MulterError"
          ? 400
          : 500);
  const message =
    err.code === 11000
      ? "A record with these values already exists"
      : err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file is too large"
        : err.message || "Server error";
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };
